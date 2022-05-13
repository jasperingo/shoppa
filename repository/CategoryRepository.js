const { Op } = require("sequelize");
const Category = require("../models/Category");
const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");
const sequelize = require("./DB");

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

  getRandomList(limit) {
    return Category.findAll({ 
      include: {
        model: SubCategory
      },
      order: sequelize.random(),
      limit,
    });
  },
  
  getListStore() {
    return Category.findAll({ 
      where: { type: Category.TYPE_STORE }, 
      include: {
        model: SubCategory
      },
      order: [['name', 'ASC']] 
    });
  },

  getListByProduct() {
    return Category.findAll({ 
      where: { type: Category.TYPE_PRODUCT }, 
      include: {
        model: SubCategory
      },
      order: [['name', 'ASC']] 
    });
  },

  getListByProductInStore(store) {
    return Category.findAll({
      where: { 
        type: Category.TYPE_PRODUCT,
        '$sub_categories.products.store_id$': store.id
      }, 
      include: {
        model: SubCategory,
        include: {
          model: Product,
          attributes: []
        }
      },
    });
  },

  getCount() {
    return Category.count();
  },

  add({ name, type, description, hide_products }) {
    return Category.create({ name, type, description, hide_products });
  },
  
  update(category, { name, description, hide_products }) {
    return Category.update({ name, description, hide_products }, { where: { id: category.id } });
  },
  
  updatePhoto(category, photo) {
    return Category.update({ photo }, { where: { id: category.id } });
  }

};

