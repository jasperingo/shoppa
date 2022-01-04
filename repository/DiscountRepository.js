const { Op } = require("sequelize");
const Discount = require("../models/Discount");
const DiscountProduct = require("../models/DiscountProduct");
const Product = require("../models/Product");
const sequelize = require("./DB");

module.exports = {

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

  async discountProductIdExists(id) {
    const discount = await DiscountProduct.findOne({ attributes: ['id'], where: { id } });
    return discount !== null;
  },
  
  async productOnDiscount(product_id) {
    const discount = await DiscountProduct.findOne({ 
      attributes: ['id'],
      where: { 
        product_id,
        '$discount.end_date$': {
          [Op.gt]: sequelize.fn('now')
        }
      },
      include: {
        model: Discount,
        attributes: ['id']
      }
    });
    return discount !== null;
  },

  get(id) {
    return Discount.findOne({
      where: { 
        id,
        deleted_at: {
          [Op.is]: null
        }
      }
    });
  },

  getListByStore(store, offset, limit) {
    return Discount.findAndCountAll({
      where: { 
        store_id: store.id,
        deleted_at: {
          [Op.is]: null
        }
      },
      order: [['created_at', 'DESC']],
      offset,
      limit,
    });
  },

  getDiscountProductList(discount, offset, limit) {
    return DiscountProduct.findAndCountAll({
      where: { 
        discount_id: discount.id,
        deleted_at: {
          [Op.is]: null
        }
      },
      include: {
        model: Product,
        attributes: Product.GET_ATTR
      },
      order: [['created_at', 'DESC']],
      offset,
      limit,
    });
  },

  create({ store_id, title, type, value, minimium_required_amount, minimium_required_quantity, start_date, end_date, discount_products }) {
    return sequelize.transaction(async (transaction)=> {

      const values = { store_id, title, type, value, start_date, end_date };

      if (minimium_required_amount !== undefined || minimium_required_amount !== null) {
        values.minimium_required_amount = minimium_required_amount;
      }

      if (minimium_required_quantity !== undefined || minimium_required_quantity !== null) {
        values.minimium_required_quantity = minimium_required_quantity;
      }

      const discount = await Discount.create(values, { transaction });
      
      for (let { product_id } of discount_products) {
        await DiscountProduct.create(
          { discount_id: discount.id, product_id },
          { transaction }
        );
      }

      return discount;
    });
  },

  update(discount, { title, type, value, minimium_required_amount, minimium_required_quantity, start_date, end_date, discount_products }) {
    return sequelize.transaction(async (transaction)=> {

      const values = { title, type, value, start_date, end_date };

      if (minimium_required_amount !== undefined || minimium_required_amount !== null) {
        values.minimium_required_amount = minimium_required_amount;
      }

      if (minimium_required_quantity !== undefined || minimium_required_quantity !== null) {
        values.minimium_required_quantity = minimium_required_quantity;
      }

      const result = await Discount.update(values, { where: { id: discount.id }, transaction });

      const IDs = [];
      
      for (let { id, product_id } of discount_products) {
        if (id === undefined) {
          let dp = await DiscountProduct.create(
            { discount_id: discount.id, product_id },
            { transaction }
          );
          IDs.push(dp.id);
        } else {
          IDs.push(id);
        }
      }
      
      await DiscountProduct.update({ deleted_at: Date.now() }, { 
        where: { 
          discount_id: discount.id, 
          id: {
            [Op.notIn]: IDs
          }
        },
        transaction
      });
      

      return result;
    });
  },

  delete(discount) {
    return sequelize.transaction(async (transaction)=> {

      const deleted_at = Date.now();

      return await Promise.all([
        Discount.update(
          { deleted_at }, 
          { where: { id: discount.id }, transaction }
        ),
        
        DiscountProduct.update(
          { deleted_at }, 
          { where: { discount_id: discount.id, deleted_at: { [Op.is]: null } }, transaction }
        )
      ]);
    });
  }

};

