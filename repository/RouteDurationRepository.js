const { Op } = require("sequelize");
const Route = require("../models/Route");
const RouteDuration = require("../models/RouteDuration");


module.exports = {

  async idExists(id) {
    const duration = await RouteDuration.findOne({ attributes: ['id'], where: { id, deleted_at: { [Op.is]: null } } });
    return duration !== null;
  },

  async routeDurationExists({ delivery_route_id, minimium, maximium, unit }) {
    const duration = await RouteDuration.findOne({where: { delivery_route_id, minimium, maximium, unit, deleted_at: { [Op.is]: null } } });
    return duration !== null;
  },

  async updateRouteDurationExists({ minimium, maximium, unit }, routeDuration) {
    const weight = await RouteDuration.findOne({ 
      where: { 
        unit,
        minimium, 
        maximium, 
        delivery_route_id: routeDuration.delivery_route_id,
        deleted_at: { [Op.is]: null },
        [Op.not]: { id: routeDuration.id } 
      } 
    });
    return weight !== null;
  },


  get(id) {
    return RouteDuration.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null }
      }
    });
  },

  getWithRoute(id) {
    return RouteDuration.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null }
      },
      include: {
        model: Route
      }
    });
  },

  create({ delivery_route_id, minimium, maximium, fee, unit }) {
    return RouteDuration.create({ delivery_route_id, minimium, maximium, fee, unit });
  },

  update(routeDuration, { minimium, maximium, fee, unit }) {
    return RouteDuration.update({ minimium, maximium, fee, unit }, { where: { id: routeDuration.id } });
  },

  delete(routeDuration) {
    return RouteDuration.update({ deleted_at: Date.now() }, { where: { id: routeDuration.id } });
  },

  getListByRoute(delivery_route_id) {
    return RouteDuration.findAll({
      where: {
        delivery_route_id,
        deleted_at: { [Op.is]: null }
      }
    })
  }

};

