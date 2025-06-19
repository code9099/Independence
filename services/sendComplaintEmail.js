
const { createEmailTransporter, emailTemplates } = require('./emailConfig');

async function sendComplaintEmail({ complaint, dept, departmentHead, imageBuffer, imageMimetype }) {
  try {
    const transporter = createEmailTransporter();
    const officer = departmentHead;
    
    // Use the enhanced email template
    const template = emailTemplates.complaintNotification;
    
    const mailOptions = {
      from: {
        name: 'JanConnect Civic Platform',
        address: process.env.EMAIL_USERNAME || 'no-reply@janconnect.org'
      },
      to: officer?.email || `${dept.toLowerCase()}.officer@delhi.gov.in`,
      cc: process.env.ADMIN_EMAIL || 'support@janconnect.in',
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
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    return { 
      success: true, 
      response: info,
      messageId: info.messageId
    };
    
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    return { 
      success: false, 
      error: err.message, 
      response: err 
    };
  }
}

module.exports = { sendComplaintEmail };
