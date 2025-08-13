const { createEmailTransporter } = require('./emailConfig');
const { htmlToText } = require('html-to-text');

/**
 * Reusable SMTP email sender
 * @param {string|string[]} to - recipient(s)
 * @param {string} subject - email subject
 * @param {string} htmlBody - HTML content
 * @param {object} options - optional { text, mailOptions }
 * @returns {Promise<{success: boolean, messageId?: string, response?: any, error?: string, code?: string}>}
 */
async function sendEmail(to, subject, htmlBody, options = {}) {
  console.log('📧 sendEmail invoked', { to, subject });

  const transporter = createEmailTransporter();

  const fromName = process.env.EMAIL_FROM_NAME || 'JanConnect Civic Platform';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USERNAME || 'no-reply@janconnect.org';

  const textBody = options.text || htmlToText(htmlBody || '', { wordwrap: 130 });

  const mailOptions = {
    from: { name: fromName, address: fromAddress },
    to,
    subject,
    html: htmlBody,
    text: textBody,
    ...options.mailOptions,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ SMTP email sent', {
      messageId: info.messageId,
      to,
      subject,
      response: info.response,
    });
    return { success: true, messageId: info.messageId, response: info };
  } catch (err) {
    console.error('❌ SMTP email failed', {
      error: err.message,
      code: err.code,
      command: err.command,
      stack: err.stack,
      to,
      subject,
    });
    return { success: false, error: err.message, code: err.code };
  }
}

module.exports = { sendEmail };
