const { Op } = require("sequelize");
const Route = require("../models/Route");
const RouteDuration = require("../models/RouteDuration");


module.exports = {

  async idExists(id) {
    const duration = await RouteDuration.findOne({ attributes: ['id'], where: { id } });
    return duration !== null;
  },

  async routeDurationExists({ delivery_route_id, minimium, maximium, unit }) {
    const duration = await RouteDuration.findOne({ where: { delivery_route_id, minimium, maximium, unit } });
    return duration !== null;
  },

  async updateRouteDurationExists({ minimium, maximium, unit }, routeDuration) {
    const weight = await RouteDuration.findOne({ 
      where: { 
        unit,
        minimium, 
        maximium, 
        delivery_route_id: routeDuration.delivery_route_id,
        id: { [Op.not]: routeDuration.id } 
      } 
    });
    return weight !== null;
  },


  get(id) {
    return RouteDuration.findByPk(id);
  },

  getWithRoute(id) {
    return RouteDuration.findOne({
      where: { id },
      include: {
        model: Route
      }
    });
  },

  
  getListByRoute(delivery_route_id) {
    return RouteDuration.findAll({ where: { delivery_route_id } });
  },

  create({ delivery_route_id, minimium, maximium, fee, unit }) {
    return RouteDuration.create({ delivery_route_id, minimium, maximium, fee, unit });
  },

  update(routeDuration, { minimium, maximium, fee, unit }) {
    return RouteDuration.update({ minimium, maximium, fee, unit }, { where: { id: routeDuration.id } });
  },

  delete(routeDuration) {
    return RouteDuration.destroy({ where: { id: routeDuration.id } });
  },

};

