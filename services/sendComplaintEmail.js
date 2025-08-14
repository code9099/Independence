
const { createEmailTransporter, emailTemplates } = require('./emailConfig');

async function sendComplaintEmail({ complaint, dept, departmentHead, directoryEmails, imageBuffer, imageMimetype }) {
  console.log('📧 Starting email send process...');
  console.log('📧 Complaint:', complaint);
  console.log('📧 Department:', dept);
  console.log('📧 Officer:', departmentHead);
  
  try {
    const transporter = createEmailTransporter();
    try { await transporter.verify(); } catch (_) { /* ignore verify errors */ }
    const officer = departmentHead;
    
    // Use the enhanced email template
    const template = emailTemplates.complaintNotification;
    
    const officerEmail = officer?.email && /@/.test(officer?.email) ? officer.email : '';
    const dir = directoryEmails || { to: undefined, cc: [], all: [] };
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USERNAME || 'lamineyamalpaglu@gmail.com';
    // In non‑production, route to admin to guarantee delivery while testing
    const isProd = process.env.NODE_ENV === 'production';
    const primaryTo = isProd ? (officerEmail || dir.to || adminEmail) : adminEmail;
    const ccList = [...(dir.cc || [])];
    if (isProd && adminEmail) ccList.push(adminEmail);
    if (isProd && officerEmail && officerEmail !== primaryTo) ccList.push(officerEmail);

    const mailOptions = {
      from: {
        name: 'JanConnect',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USERNAME || 'lamineyamalpaglu@gmail.com'
      },
      to: primaryTo,
      cc: ccList.length ? ccList.join(',') : undefined,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USERNAME,
      subject: template.subject(complaint),
      html: template.html(complaint, officer, dept),
      attachments: imageBuffer ? [
        {
          filename: "complaint-image.jpg",
          content: imageBuffer,
          contentType: imageMimetype || "image/jpeg",
          cid: "complaint_image"
        }
      ] : []
    };

    console.log(`📧 Sending complaint email to: ${mailOptions.to}`);
    console.log(`📧 Email subject: ${mailOptions.subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject,
      response: info.response
    });
    
    return { 
      success: true, 
      message: "Email sent successfully",
      response: info,
      messageId: info.messageId,
      to: mailOptions.to
    };
    
  } catch (err) {
    console.error('❌ Email sending failed:', {
      error: err.message,
      code: err.code,
      command: err.command,
      stack: err.stack
    });
    
    return { 
      success: false, 
      message: "Email sending failed",
      error: err.message, 
      response: err,
      code: err.code
    };
  }
}

module.exports = { sendComplaintEmail };
