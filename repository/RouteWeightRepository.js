const { Op } = require("sequelize");
const RouteWeight = require("../models/RouteWeight");


module.exports = {

  async routeWeightExists({ route_id, minimium, maximium }) {
    const weight = await RouteWeight.findOne({where: { route_id, minimium, maximium, deleted_at: { [Op.is]: null } } });
    return weight !== null;
  },

  async updateRouteWeightExists({ minimium, maximium }, routeWeight) {
    const weight = await RouteWeight.findOne({ 
      where: { 
        minimium, 
        maximium, 
        route_id: routeWeight.route_id,
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
        deleted_at: {
          [Op.is]: null
        }
      }
    });
  },

  create({ route_id, minimium, maximium, price }) {
    return RouteWeight.create({ route_id, minimium, maximium, price });
  },

  update(routeWeight, { minimium, maximium, price }) {
    return RouteWeight.update({ minimium, maximium, price }, { where: { id: routeWeight.id } });
  },

  delete(routeWeight) {
    return RouteWeight.update({ deleted_at: Date.now() }, { where: { id: routeWeight.id } });
  },

  getByRouteAndWeight(route_id, weight) {
    return RouteWeight.findOne({
      where: {
        route_id,
        minimium: { [Op.lte]: weight },
        maximium: { [Op.gte]: weight },
        deleted_at: { [Op.is]: null }
      }
    });
  }

};

