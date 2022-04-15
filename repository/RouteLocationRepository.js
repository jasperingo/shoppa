const { Op } = require("sequelize");
const Route = require("../models/Route");
const RouteLocation = require("../models/RouteLocation");

module.exports = {

  async existsById(id) {
    const location = await RouteLocation.findOne({ attributes: ['id'], where: { id } });
    return location !== null;
  },

  async existsByCityAndStateAndDeliveryRouteId({ delivery_route_id, state, city }) {
    const location = await RouteLocation.findOne({ where: { delivery_route_id, state, city } });
    return location !== null;
  },

  async existsByCityAndStateAndDeliveryRouteIdAndNotId({ state, city }, routeLocation) {
    const location = await RouteLocation.findOne({ 
      where: {
        city, 
        state,
        delivery_route_id: routeLocation.delivery_route_id,
        id: { [Op.not]: routeLocation.id } 
      } 
    });
    return location !== null;
  },

  get(id) {
    return RouteLocation.findByPk(id);
  },

  getWithRoute(id) {
    return RouteLocation.findOne({
      where: { id },
      include: {
        model: Route
      }
    });
  },
  
  getListByDeliveryRouteId(delivery_route_id) {
    return RouteLocation.findAll({ where: { delivery_route_id } });
  },

  create({ delivery_route_id, state, city }) {
    return RouteLocation.create({ delivery_route_id, state, city });
  },

  update(routeLocation, { state, city }) {
    return RouteLocation.update({ state, city }, { where: { id: routeLocation.id } });
  },

  delete(routeLocation) {
    return RouteLocation.destroy({ where: { id: routeLocation.id } });
  }

};
