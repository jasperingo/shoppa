const crypto = require("crypto");
const TransactionRepository = require("../repository/TransactionRepository");

module.exports = class TransactionController {

  async verifyByWebhook(req, res) {
    
    try {

      // const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');

      // if (hash !== req.headers['x-paystack-signature']) {
      //   throw new Error();
      // }

      if (req.body.event === 'charge.success') {
        
        await TransactionRepository.updatePaymentVerifed(req.body.data.reference);

      } else if (req.body.event === 'transfer.success') {

      }
      
      res.send({ reference: req.body.data.reference });

    } catch(error) {
      console.error(error)
      res.status(500).end();
    }
  }

}

