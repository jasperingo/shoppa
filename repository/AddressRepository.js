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

  async get(id) {
    return Address.findByPk(id);
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

  updateForCustomer(id, data) {
    
    return sequelize.transaction(async ()=> {

      if (data.type === Address.TYPE_DEFAULT) {
        await this.updateTypeDefaultToSubForCustomer(data.user_id);
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

      data.user_id = undefined;

      return await Address.update(data, { where: { id } });
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

