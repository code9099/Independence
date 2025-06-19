
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { submitToOfficialPortal } = require("../services/portalSubmitter");
const { sendComplaintEmail } = require("../services/sendComplaintEmail");
const { getDepartmentMapping } = require("../services/departmentMapper");

// Create new issue WITH auto-mapping and tracking
router.post("/", async (req, res) => {
  try {
    console.log('📝 Received complaint submission:', req.body);
    const complaintData = req.body;
    
    // Get department mapping and officer info
    const mapping = await getDepartmentMapping(
      complaintData.type, 
      complaintData.constituency
    );
    
    console.log('🏛️ Department mapping:', mapping);
    
    // Create issue with enhanced data
    const issue = new Issue({
      ...complaintData,
      department: mapping.department,
      assignedOfficer: mapping.officer,
      timeline: [{
        stage: "Submitted",
        details: "Complaint submitted via JanConnect",
        timestamp: new Date()
      }]
    });

    // Auto-submit to government portal (async, waits for reference)
    let portalResult = { success: false, error: "Portal submission not attempted" };
    try {
      portalResult = await submitToOfficialPortal(issue);
      if (portalResult?.reference) {
        issue.referenceNumber = portalResult.reference;
        issue.portalSubmission = {
          submitted: true,
          submittedAt: new Date(),
          portalUrl: mapping.portalUrl,
          referenceNumber: portalResult.reference
        };
        
        // Add timeline event
        await issue.addTimelineEvent(
          "Portal Registered", 
          `Registered with ${mapping.department} portal`,
          { referenceNumber: portalResult.reference }
        );
      }
    } catch (err) {
      console.error("❌ Portal submission failed:", err.message);
      portalResult = { success: false, error: err.message };
    }

    // Send email to assigned officer
    let emailStatus = { success: false, error: "Email not attempted" };
    try {
      console.log('📧 Attempting to send email to officer:', mapping.officer);
      emailStatus = await sendComplaintEmail({ 
        complaint: complaintData, 
        dept: mapping.department, 
        departmentHead: mapping.officer 
      });
      
      console.log('📧 Email result:', emailStatus);
      
      issue.emailSent = emailStatus.success;
      issue.emailLog = {
        sentAt: new Date(),
        to: mapping.officer.email,
        status: emailStatus.success ? "sent" : "failed",
        error: emailStatus.success ? undefined : emailStatus.error,
        messageId: emailStatus.response?.messageId,
      };
      
      if (emailStatus.success) {
        // Add timeline event
        await issue.addTimelineEvent(
          "Email Sent", 
          `Email sent to ${mapping.officer.name} (${mapping.officer.designation})`,
          { officerEmail: mapping.officer.email }
        );
      }
    } catch (err) {
      console.error('❌ Email sending error:', err);
      emailStatus = { success: false, error: err.message };
      issue.emailSent = false;
      issue.emailLog = {
        sentAt: new Date(),
        to: mapping.officer.email,
        status: "failed",
        error: err.message,
      };
    }

    // Save the issue
    await issue.save();
    console.log('✅ Issue saved successfully:', issue._id);

    // Always return proper JSON response
    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      issue: issue.toObject(),
      departmentMapping: mapping,
      portalSubmission: portalResult,
      emailStatus,
    });
    
  } catch (error) {
    console.error('❌ Error in complaint submission:', error);
    
    // Always return proper JSON error response
    return res.status(500).json({ 
      success: false, 
      message: "Failed to submit complaint",
      error: error.message 
    });
  }
});

// Get all issues for a reporter (by email/user id, optional)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.reporter ? { reporter: req.query.reporter } : {};
    const issues = await Issue.find(filter).sort({ submittedAt: -1 });
    res.json({ success: true, issues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get issue by ID with full timeline
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, error: "Issue not found" });
    }
    res.json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark issue as viewed by officer
router.patch('/:id/viewed', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, error: "Issue not found" });
    }
    
    if (!issue.officerViewed.viewed) {
      issue.officerViewed = {
        viewed: true,
        viewedAt: new Date(),
        viewCount: 1
      };
      
      await issue.addTimelineEvent(
        "Officer Viewed",
        "Complaint viewed by assigned officer",
        { viewedAt: new Date() }
      );
    } else {
      issue.officerViewed.viewCount += 1;
    }
    
    await issue.save();
    res.json({ success: true, issue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update issue status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, error: "Issue not found" });
    }
    
    const oldStatus = issue.status;
    issue.status = status;
    
    // Add timeline event for status change
    await issue.addTimelineEvent(
      status === "Resolved" ? "Resolved" : "In Progress",
      `Status changed from ${oldStatus} to ${status}`,
      { previousStatus: oldStatus, newStatus: status }
    );
    
    await issue.save();
    res.json({ success: true, issue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
