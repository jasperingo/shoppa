const { Op } = require("sequelize");
const Discount = require("../models/Discount");
const DiscountProduct = require("../models/DiscountProduct");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const product = await DiscountProduct.findOne({ 
      attributes: ['id'], 
      where: { id } 
    });
    return product !== null;
  },

  async idExistsForProduct(product_id, discount_id) {
    const product = await DiscountProduct.findOne({ 
      attributes: ['id'], 
      where: { product_id, discount_id } 
    });
    return product !== null;
  },

  get(id) {
    return DiscountProduct.findByPk(id);
  },

  getWithDiscount(id) {
    return DiscountProduct.findOne({
      where: { id },
      include: {
        model: Discount
      }
    });
  },

  getListByDiscount(discount, offset, limit) {
    return sequelize.transaction(async (transaction)=> {

      const { count, rows } = await  DiscountProduct.findAndCountAll({
        where: { discount_id: discount.id },
        include: {
          model: Product,
          attributes: Product.GET_ATTR,
          include: {
            model: Store,
            include: {
              model: User,
              attributes: User.GET_ATTR
            }
          }
        },
        order: [['created_at', 'DESC']],
        offset,
        limit,
      });

      for (let discount of rows) {
        let variant = await ProductVariant.findOne({
          attributes: ['id', 'price'],
          where: { product_id: discount.product.id },
          order: [['price', 'ASC']],
          transaction
        });

        discount.product.setDataValue('product_variants', (variant === null ? [] : [variant]));
      }
      
      return { count, rows };
    });
  },

  getListByNotExpiredAndProductAndQuantityAndAmount(product_id, quantity, amount) {
    return DiscountProduct.findAll({
      where: { 
        product_id,
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
    return DiscountProduct.destroy({ where: { id: discountProduct.id } });
  }

};

