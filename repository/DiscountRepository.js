const { Op } = require("sequelize");
const Discount = require("../models/Discount");
const DiscountProduct = require("../models/DiscountProduct");
const Store = require("../models/Store");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async idExistsForStore(id, store_id) {
    const discount = await Discount.findOne({ attributes: ['id'], where: { id, store_id } });
    return discount !== null;
  },

  async titleExists(title, store_id) {
    const discount = await Discount.findOne({ attributes: ['id'], where: { title, store_id } });
    return discount !== null;
  },

  async updateTitleExists(title, discount) {
    const dc = await Discount.findOne({ 
      attributes: ['id'], 
      where: { 
        title, 
        store_id: discount.store_id, 
        [Op.not]: { id: discount.id } 
      } 
    });
    return dc !== null;
  },

  get(id) {
    return Discount.findOne({
      where: { id },
      include: {
        model: Store,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      }
    });
  },

  getListByStore(store, offset, limit) {
    return Discount.findAndCountAll({
      where: { store_id: store.id },
      order: [['created_at', 'DESC']],
      offset,
      limit,
    });
  },

  create({ title, type, value, minimium_required_amount, minimium_required_quantity, start_date, end_date }, store_id) {

    const values = { store_id, title, type, value, start_date, end_date };

    if (minimium_required_amount !== undefined || minimium_required_amount !== null) {
      values.minimium_required_amount = minimium_required_amount;
    }

    if (minimium_required_quantity !== undefined || minimium_required_quantity !== null) {
      values.minimium_required_quantity = minimium_required_quantity;
    }

    return Discount.create(values);
  },

  update(discount, { title, type, value, minimium_required_amount, minimium_required_quantity, start_date, end_date }) {
    
    const values = { 
      title, 
      type, 
      value, 
      start_date, 
      end_date,
      minimium_required_amount: minimium_required_amount ?? null,
      minimium_required_quantity: minimium_required_quantity ?? null
    };

    return Discount.update(values, { where: { id: discount.id } });
  },
  
  delete(discount) {
    return sequelize.transaction(async (transaction)=> {
      return await Promise.all([
        Discount.destroy({ where: { id: discount.id }, transaction }),
        DiscountProduct.destroy({ where: { discount_id: discount.id }, transaction })
      ]);
    });
  }

};

