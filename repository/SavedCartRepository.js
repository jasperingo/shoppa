const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const SavedCart = require("../models/SavedCart");
const SavedCartItem = require("../models/SavedCartItem");
const sequelize = require("./DB");


module.exports = {

  async codeExists(code) {
    const cart = await SavedCart.findOne({ attributes: ['id'], where: { code } });
    return cart !== null;
  },

  get(id) {
    return SavedCart.findOne({
      where: { id },
      include: {
        model: SavedCartItem,
        include: {
          model: ProductVariant,
          include: {
            model: Product,
            attributes: Product.GET_ATTR
          }
        }
      }
    });
  },
  
  getByCode(code) {
    return SavedCart.findOne({
      where: { code },
      include: {
        model: SavedCartItem,
        include: {
          model: ProductVariant,
          include: {
            model: Product,
            attributes: Product.GET_ATTR
          }
        }
      }
    });
  },

  getListByUser(user, offset, limit) {
    return SavedCart.findAndCountAll({
      where: { user_id: user.id },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },
  
  create({ title, saved_cart_items }, code, user_id) {
    return sequelize.transaction(async (transaction)=> {
      
      const cart = await SavedCart.create(
        { user_id, title, code },
        { transaction }
      );
      
      for (let { product_variant_id, quantity } of saved_cart_items) {
        await SavedCartItem.create(
          { saved_cart_id: cart.id, product_variant_id, quantity },
          { transaction }
        );
      }

      return cart;
    });
  },

  delete(savedCart) {
    return sequelize.transaction(async (transaction)=> {

      for (let item of savedCart.saved_cart_items) {
        await SavedCartItem.destroy({ where: { id: item.id }, transaction });
      }
      
      return await SavedCart.destroy({ where: { id: savedCart.id }, transaction });
    });
  }

};

