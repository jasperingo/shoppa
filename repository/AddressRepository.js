const { Op } = require("sequelize");
const Address = require("../models/Address");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const address = await Address.findOne({ attributes: ['id'], where: { id } });
    return address !== null;
  },

  async typeDefaultExistsForUser(user_id) {
    const address = await Address.findOne({ attributes: ['id'], where: { user_id, type: Address.TYPE_DEFAULT } });
    return address !== null;
  },

  async titleExistsForUser(title, user_id) {
    const addr = await Address.findOne({ 
      attributes: ['id'], 
      where: {
        user_id,
        title
      } 
    });

    return addr !== null;
  },

  async updateTitleExistsForUser(title, address) {
    const addr = await Address.findOne({ 
      attributes: ['id'], 
      where: {
        title,
        user_id: address.user_id,
        [Op.not]: { id: address.id }
      } 
    });

    return addr !== null;
  },

  get(id) {
    return Address.findByPk(id);
  },

  getListByCustomer(id) {
    return Address.findAll({ 
      where: { user_id: id },
      order: [['type', 'ASC']]
    });
  },

  addOrUpdate(user, { street, city, state }) {
    return sequelize.transaction(async (transaction)=> {

      if (user.addresses.length > 0) {
        await Address.update({ street, city, state }, { where: { id: user.addresses[0].id }, transaction });
      } else {
        await Address.create({ user_id: user.id, street, city, state, type: Address.TYPE_DEFAULT }, { transaction });
      }

      if (user.status === User.STATUS_ACTIVATING && user.working_hours.length > 0) {
        await User.update({ status: User.STATUS_ACTIVE }, { where : { id: user.id }, transaction });
      }
    });
  },

  addForCustomer({ title, type, state, city, street }, user_id) {
    
    return sequelize.transaction(async (transaction)=> {

      if (type === Address.TYPE_DEFAULT) {
        await this.updateTypeDefaultToSubForCustomer(user_id, transaction);
      }

      return await Address.create({ user_id, title, type, state, city, street }, { transaction });
    });
  },
  
  updateForCustomer(address, { title, type, state, city, street }) {
    
    return sequelize.transaction(async (transaction)=> {

      if (address.type !== Address.TYPE_DEFAULT && type === Address.TYPE_DEFAULT) {
        await this.updateTypeDefaultToSubForCustomer(address.user_id, transaction);
      }

      return await Address.update(
        { title, type, state, city, street }, 
        { where: { id: address.id }, transaction }
      );
    });
  },

  updateTypeDefaultToSubForCustomer(user_id, transaction) {
    return Address.update({ type: Address.TYPE_SUB }, { 
      where: {
        user_id,
        type: Address.TYPE_DEFAULT
      },
      transaction
    });
  },

  deleteForCustomer(address) {
    return Address.destroy({ where: { id: address.id } });
  },

};

