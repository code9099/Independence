
const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true }, // MCD, PWD, DJB, DTC, Police
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  constituency: { type: String }, // e.g., "New Delhi"
  submittedAt: { type: Date, default: Date.now },
  reporter: { type: String }, // (optional) for user/account in future
});

module.exports = mongoose.model('Issue', IssueSchema);
