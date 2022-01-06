const { Op } = require("sequelize");
const ProductVariant = require("../models/ProductVariant");


module.exports = {

  async idExists(id) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { 
        id, 
        deleted_at: { [Op.is]: null } 
      } 
    });
    return product !== null;
  },

  async nameExists(name, product_id) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { 
        name, 
        product_id,
        deleted_at: {
          [Op.is]: null
        }
      } 
    });
    return product !== null;
  },

  async updateNameExists(name, productVariant) {
    const product = await ProductVariant.findOne({ 
      attributes: ['id'], 
      where: { 
        name, 
        product_id: productVariant.product_id,
        deleted_at: {
          [Op.is]: null
        }, 
        id: {
          [Op.not]: productVariant.id
        }
      } 
    });
    return product !== null;
  },

  get(id) {
    return ProductVariant.findOne({ 
      where: { 
        id,
        deleted_at: { [Op.is]: null }
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
    return ProductVariant.update({ deleted_at: Date.now() }, { where: { id: productVariant.id } });
  }


};

