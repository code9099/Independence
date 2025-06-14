
const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');

// Create new thread
router.post('/', async (req, res) => {
  try {
    const thread = new Thread(req.body);
    await thread.save();
    res.status(201).json(thread);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all threads
router.get('/', async (req, res) => {
  const threads = await Thread.find().sort({ created: -1 });
  res.json(threads);
});

module.exports = router;
