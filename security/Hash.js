
const bcrypt = require('bcrypt');

module.exports = {

  hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }

}

