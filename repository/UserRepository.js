const User = require("../models/User");

module.exports = {

  async emailVerificationTokenExists(email_verification_token) {
    const res = await User.findOne({ attributes: ['id'], where: { email_verification_token } });
    return res !== null;
  },

  getByEmailAndType(email, type) {
    return User.findOne({ 
      where: { email, type } 
    });
  },

  getByEmailVerificationToken(email_verification_token) {
    return User.findOne({ 
      where: { email_verification_token } 
    });
  },

  updateEmailVerified(user, email_verified) {
    return User.update({ email_verified }, { where: { id: user.id } });
  }
  
}
