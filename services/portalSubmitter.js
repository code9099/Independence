const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

// Map department/category to portal URLs
const PORTAL_MAP = {
  MCD: {
    url: "https://mcdonline.nic.in/complaints",
    submit: submitToMCD,
  },
  PWD: {
    url: "https://pwd.delhi.gov.in/complaints",
    submit: submitToPWD,
  },
  DJB: {
    url: "https://djb.gov.in/complaints",
    submit: submitToDJB,
  },
  // Add more departments as needed...
};

// Department heads' emails (mocked)
const DEPT_HEAD_EMAILS = {
  MCD: "mcd.head@example.com",
  PWD: "pwd.head@example.com",
  DJB: "djb.head@example.com",
};

// Main function
async function submitToOfficialPortal(issue) {
  const dept = issue.department;
  const handler = PORTAL_MAP[dept]?.submit;
  if (!handler) {
    throw new Error(`No portal handler for department ${dept}`);
  }
  // Submit to real portal
  const result = await handler(issue);

  // Email department head if submission was successful
  if (result.success) {
    await sendDeptEmail(issue, result.reference);
  }

  return result;
}

// Send email to department head (async)
async function sendDeptEmail(issue, referenceNo) {
  // For demo, use Ethereal or a test SMTP server (production: replace with real one)
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "your_ethereal_user@ethereal.email",
      pass: "your_ethereal_password",
    },
  });

  // Format fields
  const dept = issue.department;
  const type = issue.type;
  const description = issue.description;
  const location = issue.constituency || "Not specified";
  const submittedAt = issue.submittedAt
    ? new Date(issue.submittedAt).toLocaleString()
    : new Date().toLocaleString();

  // Choose recipient by department
  const to = DEPT_HEAD_EMAILS[dept] || "admin@example.com";

  const subject = `[JanConnect] New Complaint Received — ${type} (Ref: ${referenceNo})`;
  const html = `
    <p>Dear ${dept} Department Head,</p>
    <p>A new civic complaint has been submitted via JanConnect:</p>
    <ul>
      <li><strong>Complaint Type:</strong> ${type}</li>
      <li><strong>Description:</strong> ${description}</li>
      <li><strong>Constituency/Location:</strong> ${location}</li>
      <li><strong>Submitted At:</strong> ${submittedAt}</li>
      <li><strong>Portal Reference Number:</strong> ${referenceNo}</li>
    </ul>
    <p>Please take prompt action as per policy.</p>
    <p style="color:#888;margin:28px 0 0 0">— JanConnect Civic Platform</p>
  `;

  // Send email
  try {
    await transporter.sendMail({
      from: '"JanConnect Civic Platform" <no-reply@janconnect.org>',
      to,
      subject,
      html,
    });
    console.log(`Notification email sent to ${to} for complaint ${referenceNo}`);
  } catch (err) {
    console.error("Failed to send department head email:", err.message);
  }
}

// Example: mock submission for demo
async function submitToMCD(issue) {
  // Actual Puppeteer code would fill and submit the form.
  // For demo, return a fake ticket after delay.
  // TODO: Implement Puppeteer form fill on live MCD page
  // const browser = await puppeteer.launch({ headless: true });
  // ...complete your Puppeteer flow...
  // await browser.close();
  return {
    success: true,
    reference: "MCD2024" + Math.floor(Math.random() * 100000),
    dept: "MCD",
  };
}

async function submitToPWD(issue) {
  return {
    success: true,
    reference: "PWD2024" + Math.floor(Math.random() * 100000),
    dept: "PWD",
  };
}
async function submitToDJB(issue) {
  return {
    success: true,
    reference: "DJB2024" + Math.floor(Math.random() * 100000),
    dept: "DJB",
  };
}

module.exports = { submitToOfficialPortal };
