const { Op } = require("sequelize");
const Category = require("../models/Category");


module.exports = {

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
    return Category.findByPk(parseInt(id));
  },
  
  getList() {
    return Category.findAll({ order: [['created_at', 'DESC']] });
  },

  add(data) {
    return Category.create(data);
  },
  
  update(category, data) {
    category.set(data)
    return category.save();
  },
  
  updatePhoto(category, photo) {
    category.photo = photo;
    return category.save();
  }

};

