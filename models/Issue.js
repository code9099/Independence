
const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ["Submitted", "Email Sent", "Portal Registered", "Officer Viewed", "In Progress", "Resolved"],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
});

const IssueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  constituency: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reporter: { type: String },
  referenceNumber: { type: String },
  
  // Enhanced officer information
  assignedOfficer: {
    name: String,
    designation: String,
    email: String,
    phone: String,
    zone: String
  },
  
  // Timeline tracking
  timeline: [TimelineEventSchema],
  
  // Email tracking (enhanced)
  emailSent: { type: Boolean, default: false },
  emailLog: {
    sentAt: Date,
    to: String,
    html: String,
    status: String,
    error: String,
    messageId: String,
  },
  
  // Portal submission tracking
  portalSubmission: {
    submitted: { type: Boolean, default: false },
    submittedAt: Date,
    portalUrl: String,
    referenceNumber: String,
    error: String
  },
  
  // File attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now },
    url: String
  }],
  
  // Officer interaction tracking
  officerViewed: {
    viewed: { type: Boolean, default: false },
    viewedAt: Date,
    viewCount: { type: Number, default: 0 }
  }
});

// Add timeline event helper method
IssueSchema.methods.addTimelineEvent = function(stage, details = null, metadata = null) {
  this.timeline.push({
    stage,
    details,
    metadata,
    timestamp: new Date()
  });
  return this.save();
};

module.exports = mongoose.model("Issue", IssueSchema);
