const { Op } = require("sequelize");
const User = require("../models/User");

module.exports = {

  async nameExists(name) {
    const res = await User.findOne({ attributes: ['id'], where: { name } });
    return res !== null;
  },

  async updateNameExists(name, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: {
        name, 
        [Op.not]: { id }
      } 
    });
    return res !== null;
  }, 

  async emailExists(email) {
    const res = await User.findOne({ attributes: ['id'], where: { email } });
    return res !== null;
  },

  async updateEmailExists(email, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        email,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  async phoneNumberExists(phone_number) {
    const res = await User.findOne({ attributes: ['id'], where: { phone_number } });
    return res !== null;
  },

  async updatePhoneNumberExists(phone_number, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: {
        phone_number,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },

  async emailVerificationTokenExists(email_verification_token) {
    const res = await User.findOne({ attributes: ['id'], where: { email_verification_token } });
    return res !== null;
  },

  async statusIsActive(id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { id, status: User.STATUS_ACTIVE } 
    });
    return res !== null;
  },

  getByEmail(email) {
    return User.findOne({ where: { email } });
  },

  getByEmailVerificationToken(email_verification_token) {
    return User.findOne({ where: { email_verification_token } });
  },

  updateEmailVerified(user, email_verified) {
    return User.update({ email_verified }, { where: { id: user.id } });
  }
  
}
