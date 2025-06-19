
const { createEmailTransporter, emailTemplates } = require('./emailConfig');

async function sendComplaintEmail({ complaint, dept, departmentHead, imageBuffer, imageMimetype }) {
  console.log('📧 Starting email send process...');
  console.log('📧 Complaint:', complaint);
  console.log('📧 Department:', dept);
  console.log('📧 Officer:', departmentHead);
  
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
