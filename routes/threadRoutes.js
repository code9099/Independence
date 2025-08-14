
const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');

// Create new thread (parent post)
router.post('/', async (req, res) => {
  try {
    const { title, emoji, user, image, description, status, location, media } = req.body;
    const thread = new Thread({
      user: user || 'Anonymous',
      title,
      emoji,
      image,
      description,
      status,
      location,
      media,
      comments: []
    });
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

// Add a reply to a thread (to parent or nested)
router.post('/:id/replies', async (req, res) => {
  try {
    const { id } = req.params;
    const { path = [], text, user = 'Anonymous', media = [], isOfficial = false } = req.body;
    const thread = await Thread.findById(id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    const reply = { user, text, media, created: new Date(), likes: 0, isOfficial, children: [] };

    // Navigate to the correct nested array using the path (array of indexes)
    let target = thread.comments;
    for (const idx of path) {
      if (!target[idx]) return res.status(400).json({ error: 'Invalid reply path' });
      target = target[idx].replies || target[idx].children; // support both levels
    }
    target.push(reply);
    await thread.save();
    res.status(201).json(thread);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Pin/unpin a reply
router.patch('/:id/replies/pin', async (req, res) => {
  try {
    const { id } = req.params;
    const { path = [], pinned = true } = req.body;
    const thread = await Thread.findById(id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    let target = thread.comments;
    let node = null;
    for (const idx of path) {
      node = target[idx];
      if (!node) return res.status(400).json({ error: 'Invalid reply path' });
      target = node.replies || node.children;
    }
    if (!node) return res.status(400).json({ error: 'Invalid reply path' });
    node.isPinned = !!pinned;
    await thread.save();
    res.json(thread);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Like/unlike a reply
router.patch('/:id/replies/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { path = [], delta = 1 } = req.body; // +1 like, -1 unlike
    const thread = await Thread.findById(id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });

    let target = thread.comments;
    let node = null;
    for (const idx of path) {
      node = target[idx];
      if (!node) return res.status(400).json({ error: 'Invalid reply path' });
      target = node.replies || node.children;
    }
    if (!node) return res.status(400).json({ error: 'Invalid reply path' });
    node.likes = Math.max(0, (node.likes || 0) + (delta > 0 ? 1 : -1));
    await thread.save();
    res.json(thread);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
