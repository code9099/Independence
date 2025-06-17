
const nodemailer = require("nodemailer");

function getTransporter() {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME || "your_email@example.com",
      pass: process.env.EMAIL_PASSWORD || "your_password"
    }
  });
}

async function sendComplaintEmail({ complaint, dept, departmentHead, imageBuffer, imageMimetype }) {
  const transporter = getTransporter();
  
  const officer = departmentHead;
  const now = new Date();
  const formattedTime = now.toLocaleString("en-IN", {
    dateStyle: "long", timeStyle: "short"
  });

  // Enhanced HTML with officer info
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
      <div style="background:linear-gradient(135deg,#1e40af,#ec4899);color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:24px;">New Civic Complaint</h1>
        <p style="margin:5px 0 0 0;opacity:0.9;">JanConnect Civic Platform</p>
      </div>
      
      <div style="padding:20px;background:#f8f9fa;">
        <p style="margin:0 0 15px 0;font-size:16px;">Dear <strong>${officer?.name || `${dept} Officer`}</strong>,</p>
        <p style="margin:0 0 20px 0;color:#666;line-height:1.6;">
          A new civic issue has been submitted via the JanConnect Platform and has been assigned to you for resolution.
        </p>
        
        <div style="background:white;padding:20px;border-radius:8px;border-left:4px solid #1e40af;">
          <h3 style="margin:0 0 15px 0;color:#1e40af;">Complaint Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Complaint Type:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${complaint.type || "N/A"}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Location:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${complaint.location || complaint.constituency || "N/A"}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Department:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${dept}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Submitted At:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${formattedTime}</td></tr>
            ${officer?.zone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Your Zone:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;">${officer.zone}</td></tr>` : ''}
          </table>
        </div>
        
        <div style="background:white;padding:20px;border-radius:8px;margin-top:15px;">
          <h4 style="margin:0 0 10px 0;color:#1e40af;">Description:</h4>
          <p style="margin:0;line-height:1.6;color:#333;">${complaint.description || "No details provided."}</p>
        </div>
        
        ${imageBuffer ? '<div style="margin:20px 0;text-align:center;"><img src="cid:complaint_image" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #ddd;"></div>' : ""}
        
        <div style="background:#fff3cd;border:1px solid #ffeaa7;padding:15px;border-radius:8px;margin-top:20px;">
          <p style="margin:0;color:#856404;"><strong>Action Required:</strong> Please review this complaint and take appropriate action as per departmental guidelines. The citizen has been notified and is expecting updates on the resolution progress.</p>
        </div>
        
        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;color:#666;font-size:14px;">This is an automated message from the JanConnect Civic Platform</p>
          <p style="margin:5px 0 0 0;color:#999;font-size:12px;">For support, contact: support@janconnect.in</p>
        </div>
      </div>
      
      <div style="background:#1e40af;color:white;padding:15px;text-align:center;border-radius:0 0 8px 8px;">
        <p style="margin:0;font-weight:bold;">— JanConnect Civic Platform</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME || 'no-reply@janconnect.org',
    to: officer?.email || `${dept.toLowerCase()}.officer@delhi.gov.in`,
    cc: process.env.ADMIN_EMAIL || 'support@janconnect.in',
    subject: `[JanConnect] New ${complaint.type || "Civic Issue"} - ${complaint.location || complaint.constituency || "Delhi"} (Action Required)`,
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
