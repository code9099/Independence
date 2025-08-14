
const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  user: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  media: [{ type: String }],
  created: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isOfficial: { type: Boolean, default: false },
  children: { type: [Object], default: [] }
});

// Note: to allow recursion we will store nested children as plain objects compatible with ReplySchema

const CommentSchema = new mongoose.Schema({
  user: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  media: [{ type: String }],
  created: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isOfficial: { type: Boolean, default: false },
  replies: { type: [Object], default: [] }
});

const ThreadSchema = new mongoose.Schema({
  user: String,
  title: String,
  emoji: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  comments: [CommentSchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
