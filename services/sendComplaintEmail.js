
const nodemailer = require("nodemailer");

/**
 * Returns a nodemailer transporter, loading config from env or fallback values.
 * Environment variables: EMAIL_USERNAME, EMAIL_PASSWORD, SMTP_HOST, SMTP_PORT
 */
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME || "your_email@example.com",
      pass: process.env.EMAIL_PASSWORD || "your_password"
    }
  });
}

// Fallback: Can be replaced with actual Mongo/DB fetch for prod!
const DEPT_EMAILS = {
  MCD: { email: "mcd.head@example.com", name: "MCD Officer" },
  PWD: { email: "pwd.head@example.com", name: "PWD Officer" },
  DJB: { email: "djb.head@example.com", name: "DJB Officer" }
};

const ADMIN_EMAIL = "support@janconnect.in";

/**
 * Send civic complaint email to officer.
 * @param {Object} params Object incl. complaint, dept, departmentHead, image
 * @returns {Promise<{success: boolean, response: Object, error?: string}>}
 */
async function sendComplaintEmail({ complaint, dept, departmentHead, imageBuffer, imageMimetype }) {
  const transporter = getTransporter();

  const officer = departmentHead || DEPT_EMAILS[dept];
  const now = new Date();
  const formattedTime = now.toLocaleString("en-IN", {
    dateStyle: "long", timeStyle: "short"
  });

  // Compose HTML Body
  const html = `
    <div style="font-family:Arial,sans-serif">
      <p>Dear <b>${officer.name || "Officer"}</b>,</p>
      <p>
        A new civic issue has been submitted via the <b>JanConnect Platform</b>.
      </p>
      <ul>
        <li><b>📌 Complaint Type:</b> ${complaint.type || "N/A"}</li>
        <li><b>🗺️ Location:</b> ${complaint.location || complaint.constituency || "N/A"}</li>
        <li><b>🕓 Time:</b> ${formattedTime}</li>
      </ul>
      <p><b>📝 Description:</b><br />
        ${complaint.description || "No details provided."}
      </p>
      ${imageBuffer ? `<img src="cid:complaint_image" style="max-width:400px;border-radius:8px;margin:12px 0">` : ""}
      <p>We request you to take the required action at the earliest convenience.<br>The citizen has been notified and is expecting updates.</p>
      <p style="color:gray;font-size:14px;margin-top:18px">— <b>JanConnect Civic Platform</b></p>
    </div>
  `;

  // Compose mail options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME || 'no-reply@janconnect.org',
    to: officer.email,
    cc: ADMIN_EMAIL,
    subject: `[New Civic Complaint] – ${complaint.type || "Civic Issue"} reported in ${complaint.location || complaint.constituency || "Delhi"}`,
    html,
    attachments: imageBuffer ? [
      {
        filename: "complaint-image.jpg",
        content: imageBuffer,
        contentType: imageMimetype || "image/jpeg",
        cid: "complaint_image"
      }
    ] : []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, response: info };
  } catch (err) {
    return { success: false, error: err.message, response: err };
  }
}

module.exports = { sendComplaintEmail };
