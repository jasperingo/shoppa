const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async emailExists(email) {
    const res = await User.findOne({ attributes: ['id'], where: { email } });
    return res !== null;
  },

  async updateEmailExists(email, id) {
    const user = await User.findOne({ 
      attributes: ['id'], 
      where: { 
        email, 
        [Op.not]: { id } 
      } 
    });
    return user !== null;
  },

  async getPasswordById(id) {
    const user = await Customer.findOne({ 
      attributes: ['password'],
      where: { id } 
    });
    return user ? user.password : '';
  },

  async getPasswordByEmail(email) {
    const user = await Customer.findOne({ 
      attributes: ['password'],
      include: {
        model: User,
        attributes: [],
        where: { email } 
      } 
    });
    return user ? user.password : '';
  },

  async getByEmail(email) {
    return await Customer.findOne({   
      include: {
        model: User,
        where: { email }
      } 
    });
  },

  async get(id) {
    return await Customer.findOne({   
      include: {
        model: User,
        where: { id }
      } 
    });
  },

  async add(data, password) {

    data.name = `${data.first_name} ${data.last_name}`;

    return await Customer.create({
      first_name: data.first_name,
      last_name: data.last_name,
      password,
      user: {
        ...data,
        type: User.TYPE_CUSTOMER
      }
    }, { include: User });
  },

  async update(id, { first_name, last_name, email, phone_number }) {
    return await sequelize.transaction(async ()=> {

      const userUpdate = await User.update({ email, phone_number }, { where: { id } });

      const customerUpdate = await Customer.update({ first_name, last_name }, { where: { id } });

      return userUpdate[0] || customerUpdate[0];
    });
  },

  async updatePassword(id, password) {
    return await Customer.update({ password }, { where: { id } });
  }

};

