const { Op } = require("sequelize");
const Customer = require("../models/Customer");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const res = await User.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

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

  getByEmail(email) {
    return Customer.findOne({   
      include: {
        model: User,
        where: { email }
      } 
    });
  },

  get(id) {
    return Customer.findOne({   
      attributes: { exclude: ['password'] },
      include: {
        model: User,
        where: { id }
      } 
    });
  },

  getList(offset, limit) {
    return Customer.findAndCountAll({   
      attributes: ['id', 'first_name', 'last_name'],
      include: {
        model: User,
        attributes: ['id', 'photo', 'name'],
      },
      order: [[User, 'created_at', 'DESC']],
      offset,
      limit
    });
  },

  add(data, password) {

    data.name = `${data.first_name} ${data.last_name}`;

    return Customer.create({
      first_name: data.first_name,
      last_name: data.last_name,
      password,
      user: {
        ...data,
        type: User.TYPE_CUSTOMER
      }
    }, { include: User });
  },

  update(id, { first_name, last_name, email, phone_number }) {
    return sequelize.transaction(async ()=> {

      const userUpdate = await User.update({ email, phone_number, name: `${first_name} ${last_name}` }, { where: { id } });
      
      const customerUpdate = await Customer.update({ first_name, last_name }, { where: { id } });

      return userUpdate[0] || customerUpdate[0];
    });
  },

  updatePassword(id, password) {
    return Customer.update({ password }, { where: { id } });
  },

  updatePhoto(id, photo) {
    return User.update({ photo }, { where : { id } });
  }

};

