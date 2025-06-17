
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { submitToOfficialPortal } = require("../services/portalSubmitter");
const { sendComplaintEmail } = require("../services/sendComplaintEmail");
const { getDepartmentMapping } = require("../services/departmentMapper");

// Create new issue WITH auto-mapping and tracking
router.post("/", async (req, res) => {
  try {
    const complaintData = req.body;
    
    // Get department mapping and officer info
    const mapping = await getDepartmentMapping(
      complaintData.type, 
      complaintData.constituency
    );
    
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
    let portalResult = null;
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
      console.error("Portal submission failed:", err.message);
      portalResult = { success: false, error: err.message };
    }

    // Send email to assigned officer
    let emailStatus = { success: false, error: "Email not attempted" };
    try {
      emailStatus = await sendComplaintEmail({ 
        complaint: complaintData, 
        dept: mapping.department, 
        departmentHead: mapping.officer 
      });
      
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
      issue.emailSent = false;
      issue.emailLog = {
        sentAt: new Date(),
        to: mapping.officer.email,
        status: "failed",
        error: err.message,
      };
    }

    await issue.save();

    res.status(201).json({
      ...issue.toObject(),
      departmentMapping: mapping,
      portalSubmission: portalResult,
      emailStatus,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all issues for a reporter (by email/user id, optional)
router.get('/', async (req, res) => {
  const filter = req.query.reporter ? { reporter: req.query.reporter } : {};
  const issues = await Issue.find(filter).sort({ submittedAt: -1 });
  res.json(issues);
});

// Get issue by ID with full timeline
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Not found" });
    res.json(issue);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

// Mark issue as viewed by officer
router.patch('/:id/viewed', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Not found" });
    
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
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update issue status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Not found" });
    
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
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
