const { Op } = require("sequelize");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");


module.exports = {

  async idExists(id) {
    const res = await Category.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

  async nameExists(name) {
    const res = await Category.findOne({ attributes: ['id'], where: { name } });
    return res !== null;
  },

  async updateNameExists(name, id) {
    const res = await Category.findOne({ 
      attributes: ['id'], 
      where: {
        name,
        [Op.not] : { id }
      }
    });
    return res !== null;
  },

  get(id) {
    return Category.findByPk(parseInt(id), {
      include: {
        model: SubCategory
      }
    });
  },
  
  getListStore() {
    return Category.findAll({ 
      where: { type: Category.TYPE_STORE }, 
      include: {
        model: SubCategory
      },
      order: [['created_at', 'DESC']] 
    });
  },

  getListByProduct() {
    return Category.findAll({ 
      where: { type: Category.TYPE_PRODUCT }, 
      include: {
        model: SubCategory
      },
      order: [['created_at', 'DESC']] 
    });
  },

  add({ name, type, description }) {
    return Category.create({ name, type, description });
  },
  
  update(category, { name, description }) {
    return Category.update({ name, description }, { where: { id: category.id } });
  },
  
  updatePhoto(category, photo) {
    return Category.update({ photo }, { where: { id: category.id } });
  }

};

