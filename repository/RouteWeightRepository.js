const { Op } = require("sequelize");
const Route = require("../models/Route");
const RouteWeight = require("../models/RouteWeight");


module.exports = {

  async idExists(id) {
    const weight = await RouteWeight.findOne({ attributes: ['id'], where: { id, deleted_at: { [Op.is]: null } } });
    return weight !== null;
  },

  async routeWeightExists({ delivery_route_id, minimium, maximium }) {
    const weight = await RouteWeight.findOne({where: { delivery_route_id, minimium, maximium, deleted_at: { [Op.is]: null } } });
    return weight !== null;
  },

  async updateRouteWeightExists({ minimium, maximium }, routeWeight) {
    const weight = await RouteWeight.findOne({ 
      where: { 
        minimium, 
        maximium, 
        delivery_route_id: routeWeight.delivery_route_id,
        deleted_at: { [Op.is]: null },
        [Op.not]: { id: routeWeight.id } 
      } 
    });
    return weight !== null;
  },

  get(id) {
    return RouteWeight.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null }
      }
    });
  },

  getWithRoute(id) {
    return RouteWeight.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null }
      },
      include: {
        model: Route
      }
    });
  },

  create({ delivery_route_id, minimium, maximium, fee }) {
    return RouteWeight.create({ delivery_route_id, minimium, maximium, fee });
  },

  update(routeWeight, { minimium, maximium, price }) {
    return RouteWeight.update({ minimium, maximium, price }, { where: { id: routeWeight.id } });
  },

  delete(routeWeight) {
    return RouteWeight.update({ deleted_at: Date.now() }, { where: { id: routeWeight.id } });
  },

  getByRouteAndWeight(delivery_route_id, weight) {
    return RouteWeight.findOne({
      where: {
        delivery_route_id,
        minimium: { [Op.lte]: weight },
        maximium: { [Op.gte]: weight },
        deleted_at: { [Op.is]: null }
      }
    });
  }

};

