
const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  user: String,
  text: String,
  created: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  user: String,
  text: String,
  created: { type: Date, default: Date.now },
  replies: [ReplySchema]
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
