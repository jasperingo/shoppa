const Administrator = require("../models/Administrator");
const Customer = require("../models/Customer");
const User = require("../models/User");

module.exports = {

  get(id) {
    return Administrator.findOne({   
      where: { id },
      include: {
        model: Customer,
        include: {
          model: User
        } 
      } 
    });
  },

  getByEmail(email) {
    return Administrator.findOne({   
      include: {
        model: Customer,
        include: {
          model: User,
          where: { email }
        } 
      } 
    });
  },

  updatePassword(id, password) {
    return Administrator.update({ password }, { where: { id } });
  },

};

