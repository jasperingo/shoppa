const User = require("../models/User");

module.exports = {

  async emailVerificationTokenExists(email_verification_token) {
    const res = await User.findOne({ attributes: ['id'], where: { email_verification_token } });
    return res !== null;
  },

  getByEmail(email) {
    return User.findOne({ 
      where: { email } 
    });
  },

  getByEmailVerificationToken(email_verification_token) {
    return User.findOne({ 
      where: { email_verification_token } 
    });
  },

  updateEmailVerified(user, email_verified) {
    return User.update({ email_verified }, { where: { id: user.id } });
  },

  updateEmailVerificationToken(user, email_verification_token) {
    return User.update({ email_verification_token }, { where: { id: user.id } });
  },

}
