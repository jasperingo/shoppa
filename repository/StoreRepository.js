const Administrator = require("../models/Administrator");
const Customer = require("../models/Customer");
const Store = require("../models/Store");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async nameExists(name) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_STORE, name } });
    return res !== null;
  },

  async emailExists(email) {
    const res = await User.findOne({ attributes: ['id'], where: { type: User.TYPE_STORE, email } });
    return res !== null;
  },

  get(id) {
    return Store.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['name',  'email', 'phone_number']
        },
        {
          model: Administrator,
          attributes: ['id', 'role', 'type'],
          include: {
            model: Customer,
            attributes: ['first_name', 'last_name']
          }
        },
        {
          model: SubCategory,
          attributes: ['id', 'name', 'href']
        }
      ]
    });
  },

  async add(data, password, customer_id) {

    return sequelize.transaction(async ()=> {

      const store = await Store.create({
        sub_category_id: data.sub_category_id,
        user: {
          name: data.name,
          email: data.email,
          type: User.TYPE_STORE
        }
      }, { include: User });

      await Administrator.create({
        password,
        customer_id,
        store_id: store.id,
        role: Administrator.ROLE_SUPER,
        type: Administrator.TYPE_STORE
      });

      return store;
    });
  }
  
};

