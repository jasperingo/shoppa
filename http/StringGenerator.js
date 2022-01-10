const randomstring = require("randomstring");
const SavedCart = require("../models/SavedCart");
const Transaction = require("../models/Transaction");
const OrderRepository = require("../repository/OrderRepository");
const SavedCartRepository = require("../repository/SavedCartRepository");
const TransactionRepository = require("../repository/TransactionRepository");

const ALLOWED_ATTEMPTS = 3;

module.exports = {

  async savedCartCode() {

    let code, count = 0;

    do {

      code = randomstring.generate({
        length: 5,
        capitalization: 'uppercase'
      });

      code = `${SavedCart.CODE_PREFIX}${code}`;

      count++;

      if (await SavedCartRepository.codeExists(code)) {
        code = undefined;
      }

    } while(count < ALLOWED_ATTEMPTS && code === undefined);

    if (code === undefined) throw new Error('_error._generate_code');

    return code;
  },

  async orderNumber() {

    let number, count = 0;

    do {

      number = randomstring.generate({
        length: 10,
        charset: 'numeric',
        capitalization: 'uppercase'
      });

      count++;

      if (await OrderRepository.numberExists(number)) {
        number = undefined;
      }

    } while(count < ALLOWED_ATTEMPTS && number === undefined);

    if (number === undefined) throw new Error('_error._generate_number');

    return number;
  },

  async transactionReference() {

    let number, count = 0;

    do {

      number = randomstring.generate({
        length: 15,
        capitalization: 'uppercase'
      });

      number = `${Transaction.REFERENCE_PREFIX}${number}`;

      count++;

      if (await TransactionRepository.referenceExists(number)) {
        number = undefined;
      }

    } while(count < ALLOWED_ATTEMPTS && number === undefined);

    if (number === undefined) throw new Error('_error._generate_reference');

    return number;
  }


};

