const { Op } = require("sequelize");
const Address = require("../models/Address");
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

  add(user_id, { street, city, state }) {
    return Address.create({ user_id, street, city, state, type: Address.TYPE_DEFAULT });
  },

  update(address, { street, city, state }) {
    return Address.update({ street, city, state }, { where: { id: address.id }});
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

