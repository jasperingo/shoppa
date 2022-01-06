const { Op } = require("sequelize");
const Discount = require("../models/Discount");
const DiscountProduct = require("../models/DiscountProduct");
const Product = require("../models/Product");
const sequelize = require("./DB");

module.exports = {

  async idExists(product_id, discount_id) {
    const product = await DiscountProduct.findOne({ 
      attributes: ['id'], 
      where: { 
        product_id, 
        discount_id,
        deleted_at: {
          [Op.is]: null
        }
      } 
    });
    return product !== null;
  },

  get(id) {
    return DiscountProduct.findOne({
      where: { 
        id,
        deleted_at: {
          [Op.is]: null
        }
      }
    });
  },

  getListByDiscount(discount, offset, limit) {
    return DiscountProduct.findAndCountAll({
      where: { 
        discount_id: discount.id,
        deleted_at: { [Op.is]: null }
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

  getListByNotExpiredAndProductAndQuantityAndAmount(product_id, quantity, amount) {
    return DiscountProduct.findAll({
      where: { 
        product_id,
        deleted_at: { [Op.is]: null },
        '$discount.end_date$': { [Op.gt]: sequelize.fn('now') },
        '$discount.minimium_required_amount$': {
          [Op.or]: {
            [Op.is]: null,
            [Op.lte]: amount
          }
        },
        '$discount.minimium_required_quantity$': {
          [Op.or]: {
            [Op.is]: null,
            [Op.lte]: quantity
          }
        }
      },
      include: {
        model: Discount
      }
    });
  },

  create({ discount_id, product_id }) {
    return DiscountProduct.create({ discount_id, product_id });
  },

  delete(discountProduct) {
    return DiscountProduct.update({ deleted_at: Date.now() }, { where: { id: discountProduct.id } });
  }

};

