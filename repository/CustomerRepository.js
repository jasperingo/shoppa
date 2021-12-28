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
  
  add({ first_name, last_name, email }, password) {

    return Customer.create({
      first_name,
      last_name,
      password,
      user: {
        email,
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
      
      const customerUpdate = await Customer.update({ first_name, last_name }, { where: { id: customer.id }, transaction: t });

      return userUpdate[0] || customerUpdate[0];
    });
  },

  updatePassword(id, password) {
    return Customer.update({ password }, { where: { id } });
  },

  updatePhoto(customer, photo) {
    return User.update({ photo }, { where : { id: customer.user_id } });
  }

};

