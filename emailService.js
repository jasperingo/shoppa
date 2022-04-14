
const pug = require('pug');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const EmailService = {

  EMAIL_VERIFICATION: { subject: 'Verify your email', html: './views/email-email-verification.pug' },

  PASSWORD_RESET: { subject: 'Reset your password', html: './views/email-password-reset.pug' },

  NOTIFICATION_ORDER_CREATED: {},
  NOTIFICATION_ORDER_ACCEPTED: {},
  NOTIFICATION_ORDER_DECLINED: {},
  NOTIFICATION_ORDER_CANCELLED: {},
  NOTIFICATION_TRANSACTION_CREATED: {},
  NOTIFICATION_TRANSACTION_CANCELLED: {},
  NOTIFICATION_TRANSACTION_DECLINED: {},
  NOTIFICATION_TRANSACTION_PROCESSING: {},
  NOTIFICATION_TRANSACTION_FAILED: {},
  NOTIFICATION_TRANSACTION_APPROVED: {},
  NOTIFICATION_ORDER_ITEM_PROCESSING: {},
  NOTIFICATION_ORDER_ITEM_TRANSPORTED: {},
  NOTIFICATION_ORDER_ITEM_DELIVERED: {},


  send(to, type, parameters) {

    parameters.title = type.subject;
  
    return sgMail.send({
      to,
      from: {
        name: 'DailyNeeds',
        email: process.env.EMAIL_ADDRESS,
      },
      subject: type.subject,
      text: 'If you cannot see this email, please use an email client that supports HTML.',
      html: pug.renderFile(type.html, parameters)
    });
  }
};

module.exports = EmailService;
