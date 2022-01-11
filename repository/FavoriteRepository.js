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

  getListByCustomer(customer, offset, limit) {
    return sequelize.transaction(async (transaction)=> {

      const count = await Favorite.count({
        where: { customer_id: customer.id },
        transaction
      });

      const rows = await Favorite.findAll({
        where: { customer_id: customer.id },
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
              model: ProductVariant,
              attributes: ['price'],
              where: {
                deleted_at: {
                  [Op.is]: null
                }
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

