
const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  constituency: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reporter: { type: String },
  referenceNumber: { type: String }, // ADDED: stores ref from gov portal
});
module.exports = mongoose.model("Issue", IssueSchema);
