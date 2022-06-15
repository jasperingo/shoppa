const { Op } = require("sequelize");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const SavedCartItem = require("../models/SavedCartItem");
const sequelize = require("./DB");


module.exports = {

  async idExists(id) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { id } 
    });
    return product !== null;
  },

  async idExistsForStore(id, store_id) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { id, '$product.store_id$': store_id },
      include: {
        model: Product,
        attributes: ['id']
      }
    });
    return product !== null;
  },

  async nameExists(name, product_id) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { name, product_id } 
    });
    return product !== null;
  },

  async updateNameExists(name, productVariant) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { 
        name, 
        product_id: productVariant.product_id,
        id: { [Op.not]: productVariant.id }
      } 
    });
    return product !== null;
  },
  
  get(id) {
    return ProductVariant.findByPk(id);
  },
  
  getWithProduct(id) {
    return ProductVariant.findOne({ 
      where: { id },
      include: {
        model: Product
      }
    });
  },
  
  create({ product_id, name, price, quantity, weight, available }) {
    return ProductVariant.create({ product_id, name, price, quantity, weight, available });
  },
  
  update(productVariant, { name, price, quantity, weight, available }) {
    return ProductVariant.update({ name, price, quantity, weight, available }, { where: { id: productVariant.id } });
  },

  delete(productVariant) {
    return sequelize.transaction(async (transaction)=> {
      return await Promise.all([
        ProductVariant.destroy({ where: { id: productVariant.id }, transaction }),
        SavedCartItem.destroy({ where: { product_variant_id: productVariant.id }, transaction }),
      ]);
    });
  }

};

