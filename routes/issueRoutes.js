
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { submitToOfficialPortal } = require("../services/portalSubmitter");

// Create new issue WITH auto-forward
router.post("/", async (req, res) => {
  try {
    const issue = new Issue(req.body);

    // Auto-submit to government portal (async, waits for reference)
    let portalResult = null;
    try {
      portalResult = await submitToOfficialPortal(issue);
      if (portalResult?.reference) {
        issue.referenceNumber = portalResult.reference;
        issue.status = "Pending"; // Optionally update based on portal's state
      }
      // Track auto email sent
      if (typeof portalResult?.autoEmailSent === "boolean") {
        issue.autoEmailSent = portalResult.autoEmailSent;
      }
    } catch (err) {
      // Fallback if portal submission fails
      console.error("Portal submission failed:", err.message);
      portalResult = { success: false, error: err.message };
    }

    await issue.save();

    res.status(201).json({
      ...issue.toObject(),
      portalSubmission: portalResult,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all issues for a reporter (by email/user id, optional)
router.get('/', async (req, res) => {
  // Filter by reporter if ?reporter= supplied
  const filter = req.query.reporter ? { reporter: req.query.reporter } : {};
  const issues = await Issue.find(filter).sort({ submittedAt: -1 });
  res.json(issues);
});

// Get issue by ID
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ error: "Not found" });
    res.json(issue);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

module.exports = router;
