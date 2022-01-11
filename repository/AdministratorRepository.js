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
      where: { '$customer.user.email$': email },
      include: {
        model: Customer,
        include: {
          model: User,
        } 
      } 
    });
  },

  getByEmailAndStore(email, store_id) {
    return Administrator.findOne({ 
      attributes: [...Administrator.GET_ATTR, 'password'], 
      where: { 
        store_id,
        type: Administrator.TYPE_STORE,
        '$customer.user.email$': email
      },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        } 
      }
    });
  },
  
  getByEmailAndDeliveryFirm(email, delivery_firm_id) {
    return Administrator.findOne({ 
      attributes: [...Administrator.GET_ATTR, 'password'],
      where: { 
        delivery_firm_id,
        type: Administrator.TYPE_DELIVERY_FIRM,
        '$customer.user.email$': email,
      },
      include: {
        model: Customer,
        attributes: Customer.GET_ATTR,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      } 
    });
  },

  updatePassword(id, password) {
    return Administrator.update({ password }, { where: { id } });
  },

};

