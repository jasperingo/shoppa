const { Op } = require("sequelize");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");


module.exports = {

  async idForStoreExists(id) {
    const res = await SubCategory.findOne({ 
      attributes: ['id'], 
      where: { id },
      include: {
        model: Category,
        where: { type: Category.TYPE_STORE }
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

  add(data) {
    return SubCategory.create(data);
  },

  update(subCategory, data) {
    subCategory.set({ name: data.name, description: data.description });
    return subCategory.save();
  },

  get(id) {
    return SubCategory.findByPk(parseInt(id));
  },
  
  updatePhoto(subCategory, photo) {
    subCategory.photo = photo;
    return subCategory.save();
  }

};

