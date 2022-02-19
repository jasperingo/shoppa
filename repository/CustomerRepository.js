const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const User = require("../models/User");
const WithdrawalAccount = require("../models/WithdrawalAccount");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const res = await Customer.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

  async emailExists(email) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_CUSTOMER, email } });
    return res !== null;
  },

  async updateEmailExists(email, id) {
    const user = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        email, 
        type: User.TYPE_CUSTOMER,
        [Op.not]: { id } 
      } 
    });
    return user !== null;
  },

  async phoneNumberExists(phone_number) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_CUSTOMER, phone_number } });
    return res !== null;
  },

  async updatePhoneNumberExists(phone_number, id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        type: User.TYPE_CUSTOMER, 
        phone_number,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  },
  
  async statusIsActive(id) {
    const res = await User.findOne({ 
      attributes: ['id'], 
      where: {
        id, 
        type: User.TYPE_CUSTOMER, 
        status: User.STATUS_ACTIVE
      } 
    });
    return res !== null;
  },

  getByEmail(email) {
    return Customer.findOne({   
      include: {
        model: User,
        where: { 
          email,
          type: User.TYPE_CUSTOMER
        }
      } 
    });
  },

  get(id) {
    return Customer.findOne({
      where: { id },
      include: {
        model: User,
        include: {
          model: WithdrawalAccount,
          attributes: WithdrawalAccount.GET_ATTR
        }
      } 
    });
  },

  getList(offset, limit) {
    return Customer.findAndCountAll({   
      attributes: Customer.GET_ATTR,
      include: {
        model: User,
        attributes: User.GET_ATTR,
      },
      order: [[User, 'created_at', 'DESC']],
      offset,
      limit
    });
  },

  getCount() {
    return Customer.count();
  },
  
  add({ first_name, last_name, email, phone_number }, password) {

    return Customer.create({
      first_name,
      last_name,
      password,
      user: {
        email,
        phone_number,
        name: `${first_name} ${last_name}`,
        type: User.TYPE_CUSTOMER,
        status: User.STATUS_ACTIVE
      }
    }, { include: User });
  },

  update(customer, { first_name, last_name, email, phone_number }) {
    return sequelize.transaction(async (t)=> {

      const userUpdate = await User.update(
        { email, phone_number, name: `${first_name} ${last_name}` }, 
        { where: { id: customer.user_id }, transaction: t }
      );
      
      const customerUpdate = await Customer.update(
        { first_name, last_name }, 
        { where: { id: customer.id }, transaction: t }
      );

      return userUpdate[0] || customerUpdate[0];
    });
  },

  updatePassword(customer, password) {
    return Customer.update({ password }, { where: { id: customer.id } });
  },

  updatePhoto(customer, photo) {
    return User.update({ photo }, { where : { id: customer.user_id } });
  },

  updateStatus(customer, status) {
    return User.update({ status }, { where : { id: customer.user_id } })
  },

};

