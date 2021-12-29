
const { notEmpty } = require('../ValidationRules');

module.exports = {

  street: {
    notEmpty
  },

  city: {
    notEmpty
  },

  state: {
    notEmpty
  }

};
