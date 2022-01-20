const { Op } = require("sequelize");
const Route = require("../models/Route");
const RouteWeight = require("../models/RouteWeight");


module.exports = {

  async idExists(id) {
    const weight = await RouteWeight.findOne({ attributes: ['id'], where: { id } });
    return weight !== null;
  },

  async routeWeightExists({ delivery_route_id, minimium, maximium }) {
    const weight = await RouteWeight.findOne({where: { delivery_route_id, minimium, maximium } });
    return weight !== null;
  },

  async updateRouteWeightExists({ minimium, maximium }, routeWeight) {
    const weight = await RouteWeight.findOne({ 
      where: { 
        minimium, 
        maximium, 
        delivery_route_id: routeWeight.delivery_route_id,
        id: { [Op.not]: routeWeight.id } 
      } 
    });
    return weight !== null;
  },

  get(id) {
    return RouteWeight.findByPk(id);
  },

  getWithRoute(id) {
    return RouteWeight.findOne({
      where: { id },
      include: {
        model: Route
      }
    });
  },

  getByRouteAndWeight(delivery_route_id, weight) {
    return RouteWeight.findOne({
      where: {
        delivery_route_id,
        minimium: { [Op.lte]: weight },
        maximium: { [Op.gte]: weight }
      }
    });
  },

  create({ delivery_route_id, minimium, maximium, fee }) {
    return RouteWeight.create({ delivery_route_id, minimium, maximium, fee });
  },

  update(routeWeight, { minimium, maximium, fee }) {
    return RouteWeight.update({ minimium, maximium, fee }, { where: { id: routeWeight.id } });
  },

  delete(routeWeight) {
    return RouteWeight.destroy({ where: { id: routeWeight.id } });
  },

};

