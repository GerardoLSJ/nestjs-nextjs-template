#!/usr/bin/env node

/**
 * Generate Ethereal Email test credentials for deployment testing
 * These credentials allow testing email verification without real SMTP service
 */

const nodemailer = require('nodemailer');

async function generateEtherealCredentials() {
  console.log('🔧 Generating Ethereal Email test credentials...\n');

  try {
    const testAccount = await nodemailer.createTestAccount();

    console.log('✅ Ethereal Email credentials generated successfully!\n');
    console.log('═'.repeat(60));
    console.log('SMTP Configuration (for Container App environment variables)');
    console.log('═'.repeat(60));
    console.log('');
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log(`SMTP_FROM=noreply@${testAccount.smtp.host}`);
    console.log('');
    console.log('═'.repeat(60));
    console.log('📧 Email Inbox URL (check emails here)');
    console.log('═'.repeat(60));
    console.log('');
    console.log(`https://ethereal.email/login`);
    console.log(`Email: ${testAccount.user}`);
    console.log(`Password: ${testAccount.pass}`);
    console.log('');
    console.log('Or view messages directly at:');
    console.log(`https://ethereal.email/messages`);
    console.log('');
    console.log('⚠️  NOTE: These credentials are temporary and for testing only!');
    console.log('    For production, use Azure Communication Services or SendGrid.');
    console.log('');

    // Return credentials for programmatic use
    return {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      user: testAccount.user,
      pass: testAccount.pass,
      from: `noreply@${testAccount.smtp.host}`,
      webUrl: `https://ethereal.email/login`,
    };
  } catch (error) {
    console.error('❌ Error generating Ethereal credentials:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateEtherealCredentials()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { generateEtherealCredentials };
