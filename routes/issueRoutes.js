
const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// Create new issue
router.post('/', async (req, res) => {
  try {
    const issue = new Issue(req.body);
    await issue.save();
    res.status(201).json(issue);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all issues
router.get('/', async (req, res) => {
  const issues = await Issue.find().sort({ submittedAt: -1 });
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
