const Administrator = require("../models/Administrator");
const Customer = require("../models/Customer");
const PasswordReset = require("../models/PasswordReset");
const sequelize = require("./DB");


module.exports = {

  async tokenExists(token) {
    const pwd = await PasswordReset.findOne({ attributes: ['id'], where: { token } });
    return pwd !== null;
  },

  getByToken(token) {
    return PasswordReset.findOne({ where: { token } });
  },

  createCustomer(token, customer) {
    const date = new Date(Date.now() + PasswordReset.EXPIRE_DURATION);
    return PasswordReset.create({ token, customer_id: customer.id, expires_at: date });
  },
  
  createAdministrator(token, admin) {
    const date = new Date(Date.now() + PasswordReset.EXPIRE_DURATION);
    return PasswordReset.create({ token, administrator_id: admin.id, expires_at: date });
  },

  resetPassword(passwordReset, password) {
    return sequelize.transaction(async (transaction)=> {

      if (passwordReset.customer_id !== null) {
        await Customer.update({ password }, { where: { id: passwordReset.customer_id }, transaction });
      } else if (passwordReset.administrator_id !== null) {
        await Administrator.update({ password }, { where: { id: passwordReset.administrator_id }, transaction });
      }

      return await PasswordReset.destroy({ where: { id: passwordReset.id }, transaction });
    });
  },

};

