const { Op } = require("sequelize");
const Address = require("../models/Address");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async titleExistsForUser(title, user_id) {
    const addr = await Address.findOne({ 
      attributes: ['id'], 
      where: {
        [Op.and]: [
          { user_id },
          { title }
        ]
      } 
    });

    return addr !== null;
  },

  async updateTitleExistsForUser(title, user_id, id) {
    const addr = await Address.findOne({ 
      attributes: ['id'], 
      where: {
        [Op.and]: [
          { user_id },
          { title },
          { [Op.not]: { id } }
        ]
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
    return sequelize.transaction(async ()=> {

      if (user.addresses.length > 0) {
        await Address.update({ street, city, state }, { where: { id: user.addresses[0].id }});
      } else {
        await Address.create({ user_id: user.id, street, city, state, type: Address.TYPE_DEFAULT });
      }

      if (user.status === User.STATUS_ACTIVATING && user.working_hours.length > 0) {
        await User.update({ status: User.STATUS_ACTIVE }, { where : { id: user.id } });
      }
    });
  },

  addForCustomer(data) {
    
    return sequelize.transaction(async ()=> {

      if (data.type === Address.TYPE_DEFAULT) {
        await this.updateTypeDefaultToSubForCustomer(data.user_id);
      } else {
        const addr = await Address.findOne({ 
          attributes: ['id'], 
          where: {
            [Op.and]: [
              { user_id: data.user_id },
              { type: Address.TYPE_DEFAULT }
            ]
          } 
        });

        if (addr === null) data.type = Address.TYPE_DEFAULT;
      }

      return await Address.create(data);
    });
  },

  updateForCustomer(address, data) {
    
    return sequelize.transaction(async ()=> {

      if (data.type === Address.TYPE_DEFAULT) {
        await this.updateTypeDefaultToSubForCustomer(address.user_id);
      } else {
        const addr = await Address.findOne({ 
          attributes: ['id'], 
          where: {
            [Op.and]: [
              { id },
              { type: Address.TYPE_DEFAULT }
            ]
          } 
        });

        if (addr !== null) data.type = Address.TYPE_DEFAULT;
      }
      
      address.set({
        title: data.title,
        street: data.street,
        city: data.city,
        state: data.state,
        type: data.type
      });

      return await address.save();
    });
  },

  updateTypeDefaultToSubForCustomer(user_id) {
    return Address.update({ type: Address.TYPE_SUB }, { 
      where: {
        [Op.and]: [
          { user_id },
          { type: Address.TYPE_DEFAULT }
        ]
      }
    });
  }

};

