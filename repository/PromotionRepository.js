
const { Op } = require("sequelize");
const Promotion = require("../models/Promotion");
const sequelize = require("./DB");

module.exports = {

  get(id) {
    return Promotion.findByPk(id);
  },

  create({ title, link, link_type, amount, duration }) {
    return Promotion.create({ title, link, link_type, amount, duration });
  }
};
