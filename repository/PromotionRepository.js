
const { Op } = require("sequelize");
const Promotion = require("../models/Promotion");
const sequelize = require("./DB");

module.exports = {

  get(id) {
    return Promotion.findByPk(id);
  },

  getList(offset, limit) {
    return Promotion.findAndCountAll({
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  getRandomList(limit) {
    return Promotion.findAll({
      group: 'id',
      having: sequelize.where(
        sequelize.fn(
          'sum', 
          sequelize.where(
            sequelize.fn('unix_timestamp', sequelize.col('created_at')), 
            '+', 
            sequelize.where(sequelize.col('duration'), '*', 24 * 60 * 60)
          )
        ), 
        { [Op.gt]: Math.round((new Date().getTime()) / 1000) }
      ),
      order: sequelize.random(),
      limit,
    });
  },

  create({ title, link, link_type, amount, duration }) {
    return Promotion.create({ title, link, link_type, amount, duration });
  },

  updatePhoto(promotion, photo) {
    return Promotion.update({ photo }, { where : { id: promotion.id } });
  },

  delete(promotion) {
    return Promotion.destroy({ where: { id: promotion.id } });
  }

};
