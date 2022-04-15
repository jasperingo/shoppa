
const pug = require('pug');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const EmailService = {

  EMAIL_VERIFICATION: { subject: 'Verify your email', html: './views/email-email-verification.pug' },

  PASSWORD_RESET: { subject: 'Reset your password', html: './views/email-password-reset.pug' },

  ORDER_CREATED: { subject: 'Order placed', html: './views/email-order-placed.pug' },

  ORDER_ACCEPTED: { subject: 'Order accepted', html: './views/email-order-accepted.pug' },

  ORDER_DECLINED: { subject: 'Order declined', html: './views/email-order-declined.pug' },

  ORDER_CANCELLED: { subject: 'Order cancelled', html: './views/email-order-cancelled.pug' },
  
  ORDER_FULFILLED: { subject: 'Order fulfilled', html: './views/email-order-fulfilled.pug' },

  TRANSACTION_CREATED: { subject: 'Transaction requested', html: './views/email-transaction-created.pug' },

  TRANSACTION_CANCELLED: { subject: 'Transaction cancelled', html: './views/email-transaction-cancelled.pug' },

  TRANSACTION_DECLINED: { subject: 'Transaction declined', html: './views/email-transaction-declined.pug' },

  TRANSACTION_PROCESSING: { subject: 'Transaction processing', html: './views/email-transaction-processing.pug' },

  TRANSACTION_FAILED: { subject: 'Transaction failed', html: './views/email-transaction-failed.pug' },

  TRANSACTION_APPROVED: { subject: 'Transaction approved', html: './views/email-transaction-approved.pug' },

  send(to, type, parameters) {

    parameters.title = type.subject;
    parameters.clientUrl = process.env.CLIENT_DOMAIN_NAME;
  
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
