
const nodemailer = require('nodemailer');

// Create email transporter with better error handling
function createEmailTransporter() {
  console.log('📧 Creating email transporter...');

  const auth = {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  };

  const service = process.env.SMTP_SERVICE || 'gmail';
  const host = process.env.SMTP_HOST || (service === 'gmail' ? 'smtp.gmail.com' : undefined);
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  const baseConfig = host
    ? { host, port, secure, auth, debug: true }
    : { service, port, secure, auth, debug: true };

  console.log('📧 Email config:', {
    service: baseConfig.service || 'custom-host',
    host: baseConfig.host || 'via-service',
    port: baseConfig.port,
    secure: baseConfig.secure,
    user: auth.user ? '✓ Set' : '✗ Missing',
    pass: auth.pass ? '✓ Set' : '✗ Missing',
  });

  return nodemailer.createTransport(baseConfig);
}

// Enhanced email templates
const emailTemplates = {
  complaintNotification: {
    subject: (complaint) => `🚨 New Complaint: ${complaint.type} - JanConnect`,
    html: (complaint, officer, department) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .complaint-box { background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; }
          .officer-info { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
          .btn { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏛️ JanConnect - New Complaint Alert</h1>
        </div>
        <div class="content">
          <div class="officer-info">
            <h3>👨‍💼 Dear ${officer?.name || 'Officer'},</h3>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Designation:</strong> ${officer?.designation || 'Government Officer'}</p>
          </div>
          
          <div class="complaint-box">
            <h3>📋 Complaint Details</h3>
            <p><strong>Type:</strong> ${complaint.type}</p>
            <p><strong>Description:</strong> ${complaint.description}</p>
            <p><strong>Reporter:</strong> ${complaint.reporter}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Priority:</strong> High</p>
          </div>
          
          <p>⚡ <strong>Action Required:</strong> Please review this complaint and take appropriate action within 7 working days.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://janconnect.org/dashboard" class="btn">View Full Details</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from JanConnect Civic Platform</p>
          <p>📧 Do not reply to this email | 🌐 Visit: janconnect.org</p>
        </div>
      </body>
      </html>
    `
  }
};

module.exports = {
  createEmailTransporter,
  emailTemplates
};
