const crypto = require("crypto");
const UnauthorizedException = require("../http/exceptions/UnauthorizedException");

module.exports = async (req, res, next)=> {

  try {
    
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      //throw new Error('paystack signature is incorrect');
    }

    next();

  } catch (error) {
    next(new UnauthorizedException(error));
  }
};

