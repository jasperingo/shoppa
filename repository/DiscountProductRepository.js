const { Op } = require("sequelize");
const DiscountProduct = require("../models/DiscountProduct");
const Product = require("../models/Product");

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

  create({ discount_id, product_id }) {
    return DiscountProduct.create({ discount_id, product_id });
  },

  delete(discountProduct) {
    return DiscountProduct.update({ deleted_at: Date.now() }, { where: { id: discountProduct.id } });
  }

};

