const { Op } = require("sequelize");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

module.exports = {

  async idForStoreExists(id) {
    const res = await SubCategory.findOne({ 
      attributes: ['id'], 
      where: { 
        id,
        '$category.type$': Category.TYPE_STORE
      },
      include: {
        model: Category
      }
    });
    return res !== null;
  },

  async idForProductExists(id) {
    const res = await SubCategory.findOne({ 
      attributes: ['id'], 
      where: { 
        id,
        '$category.type$': Category.TYPE_PRODUCT
      },
      include: {
        model: Category
      }
    });
    return res !== null;
  },
  
  async nameExists(name) {
    const res = await SubCategory.findOne({ attributes: ['id'], where: { name } });
    return res !== null;
  },

  async updateNameExists(name, id) {
    const res = await SubCategory.findOne({ 
      attributes: ['id'], 
      where: {
        name,
        [Op.not] : { id }
      }
    });
    return res !== null;
  },

  get(id) {
    return SubCategory.findByPk(parseInt(id));
  },

  add({ category_id, name, description }) {
    return SubCategory.create({ category_id, name, description });
  },

  update(subCategory, { name, description }) {
    return SubCategory.update({ name, description }, { where: { id: subCategory.id } });
  },
  
  updatePhoto(subCategory, photo) {
    return SubCategory.update({ photo }, { where: { id: subCategory.id } });
  }

};

