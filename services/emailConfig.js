
const nodemailer = require("nodemailer");

// Email configuration with enhanced error handling
function createEmailTransporter() {
  // Check for required environment variables
  const requiredEnvVars = ['EMAIL_USERNAME', 'EMAIL_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing email configuration: ${missingVars.join(', ')}`);
    console.warn('📧 Email functionality will be limited. Please set up Gmail SMTP credentials.');
  }

  const config = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USERNAME || "your_email@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "your_app_password"
    },
    tls: {
      rejectUnauthorized: false // For development
    }
  };

  return nodemailer.createTransporter(config);
}

// Test email connection
async function testEmailConnection() {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
}

// Email templates
const emailTemplates = {
  complaintNotification: {
    subject: (complaint) => `[JanConnect] New ${complaint.type} Complaint - ${complaint.constituency || 'Delhi'} (Action Required)`,
    
    html: (complaint, officer, department) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #ec4899 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🏛️ JanConnect</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.95; font-size: 16px;">Civic Complaint Management Platform</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 30px;">
          <div style="border-left: 4px solid #1e40af; padding-left: 20px; margin-bottom: 25px;">
            <h2 style="color: #1e40af; margin: 0 0 8px 0; font-size: 24px;">New Complaint Assigned</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">Dear ${officer?.name || `${department} Officer`},</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            A new civic complaint has been submitted through JanConnect and assigned to your department for resolution. Please review and take appropriate action.
          </p>
          
          <!-- Complaint Details Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #ddd6fe; padding-bottom: 10px;">📋 Complaint Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600; color: #374151; width: 140px;">Complaint Type:</td>
                <td style="padding: 12px 0; color: #1f2937;">${complaint.type}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600; color: #374151;">Location:</td>
                <td style="padding: 12px 0; color: #1f2937;">${complaint.constituency || complaint.location || 'Not specified'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600; color: #374151;">Department:</td>
                <td style="padding: 12px 0; color: #1f2937;">
                  <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                    ${department}
                  </span>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; font-weight: 600; color: #374151;">Submitted:</td>
                <td style="padding: 12px 0; color: #1f2937;">${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</td>
              </tr>
              ${officer?.zone ? `
              <tr>
                <td style="padding: 12px 0; font-weight: 600; color: #374151;">Your Zone:</td>
                <td style="padding: 12px 0; color: #1f2937;">${officer.zone}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <!-- Description -->
          <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">📝 Issue Description</h4>
            <p style="color: #451a03; margin: 0; line-height: 1.6; font-size: 15px;">
              ${complaint.description || 'No detailed description provided.'}
            </p>
          </div>
          
          <!-- Action Required -->
          <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h4 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">⚡ Action Required</h4>
            <p style="color: #451a03; margin: 0; line-height: 1.6;">
              Please acknowledge receipt of this complaint and provide an estimated timeline for resolution. 
              The citizen has been notified and expects regular updates on the progress.
            </p>
          </div>
          
          <!-- Contact Info -->
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 20px; text-align: center;">
            <p style="color: #075985; margin: 0 0 8px 0; font-size: 14px;">
              📞 For any queries regarding this complaint system:
            </p>
            <p style="color: #0369a1; margin: 0; font-weight: 600;">
              Email: support@janconnect.in | Phone: +91-11-1234-5678
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="margin: 0; font-weight: 600; font-size: 16px;">— JanConnect Civic Platform —</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">Making Delhi Better, One Complaint at a Time</p>
        </div>
      </div>
    `
  }
};

module.exports = {
  createEmailTransporter,
  testEmailConnection,
  emailTemplates
};
