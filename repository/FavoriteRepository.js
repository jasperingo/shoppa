const { Op } = require("sequelize");
const Category = require("../models/Category");
const Customer = require("../models/Customer");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Store = require("../models/Store");
const SubCategory = require("../models/SubCategory");
const User = require("../models/User");
const sequelize = require("./DB");


module.exports = {

  async exists(product_id, customer_id) {
    const fav = await Favorite.findOne({ attributes: ['id'], where: { product_id, customer_id } });
    return fav !== null;
  },

  get(id) {
    return Favorite.findOne({
      where: { id },
      include: [
        {
          model: Customer,
          attributes: Customer.GET_ATTR,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: Product,
          attributes: Product.GET_ATTR
        }
      ]
    });
  },

  getIdByProductAndCustomer(product_id, customer_id) {
    return Favorite.findOne({
      attributes: ['id'],
      where: { product_id, customer_id },
    });
  },

  getListByCustomer(customer, offset, limit) {
    return sequelize.transaction(async (transaction)=> {

      const { count, rows } = await Favorite.findAndCountAll({
        where: { 
          customer_id: customer.id,
          '$product.store.user.status$': User.STATUS_ACTIVE 
        },
        include: {
          model: Product,
          include: [
            {
              model: Store,
              include: {
                model: User,
                attributes: User.GET_ATTR
              }
            },
            {
              model: SubCategory,
              attributes: SubCategory.GET_ATTR,
              include: {
                model: Category,
                attributes: Category.GET_ATTR,
              }
            },
          ],
        },
        order: [['created_at', 'DESC']],
        offset,
        limit,
        transaction
      });

      for (let fav of rows) {
        let variant = await ProductVariant.findOne({
          attributes: ['id', 'price'],
          where: { product_id: fav.product.id },
          order: [['price', 'ASC']],
        });
        
        fav.product.setDataValue('product_variants', (variant === null ? [] : [variant]));
      }

      return { count, rows };
    });
  },

  create({ product_id }, customer_id) {
    return Favorite.create({ product_id, customer_id });
  },
  
  delete(favorite) {
    return Favorite.destroy({ where: { id: favorite.id } });
  }

};

