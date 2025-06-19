
const express = require('express');
const router = express.Router();
const { testEmailConnection, createEmailTransporter } = require('../services/emailConfig');

// Test email configuration
router.get('/email-config', async (req, res) => {
  try {
    const isConnected = await testEmailConnection();
    
    const config = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      username: process.env.EMAIL_USERNAME || "Not configured",
      hasPassword: !!process.env.EMAIL_PASSWORD,
      adminEmail: process.env.ADMIN_EMAIL || "Not configured"
    };
    
    res.json({
      success: true,
      emailConfigured: isConnected,
      config: config,
      message: isConnected 
        ? "✅ Email configuration is working!"
        : "❌ Email configuration needs setup. Check SETUP_GUIDE.md"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to test email configuration"
    });
  }
});

// Send test email
router.post('/send-test-email', async (req, res) => {
  try {
    const { to } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: "Email address required" });
    }
    
    const transporter = createEmailTransporter();
    
    const testEmail = {
      from: {
        name: 'JanConnect Test',
        address: process.env.EMAIL_USERNAME || 'no-reply@janconnect.org'
      },
      to: to,
      subject: '✅ JanConnect Email Test - Configuration Working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">🎉 Email Configuration Test</h2>
          <p>Congratulations! Your JanConnect email configuration is working properly.</p>
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin: 0 0 10px 0;">✅ What this means:</h3>
            <ul style="color: #075985; margin: 0;">
              <li>Gmail SMTP is properly configured</li>
              <li>Complaint emails will be sent to officers</li>
              <li>Email status will be logged in database</li>
              <li>Timeline updates will work correctly</li>
            </ul>
          </div>
          <p style="color: #374151;">
            <strong>Next steps:</strong> Update officer email addresses in 
            <code>services/departmentMapper.js</code> with real Delhi government emails.
          </p>
          <hr style="margin: 30px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            — JanConnect Civic Platform —
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(testEmail);
    
    res.json({
      success: true,
      messageId: info.messageId,
      message: `✅ Test email sent successfully to ${to}`
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to send test email"
    });
  }
});

module.exports = router;
