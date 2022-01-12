const { Op } = require("sequelize");
const DeliveryFirm = require("../models/DeliveryFirm");
const Route = require("../models/Route");
const RouteDuration = require("../models/RouteDuration");
const RouteWeight = require("../models/RouteWeight");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const res = await Route.findOne({ attributes: ['id'], where: { id, deleted_at: { [Op.is]: null } } });
    return res !== null;
  },

  async idExistsForDeliveryFirm(id, delivery_firm_id) {
    const route = await Route.findOne({ attributes: ['id'], where: { id, delivery_firm_id, deleted_at: { [Op.is]: null } } });
    return route !== null;
  },

  async routeExists(delivery_firm_id, { state, city }) {
    const route = await Route.findOne({ 
      attributes: ['id'],
      where: { delivery_firm_id, state, city, deleted_at: { [Op.is]: null } } 
    });
    return route !== null;
  },
  
  async updateRouteExists(route, { state, city }) {

    const res = await Route.findOne({
      attributes: ['id'],
      where: { 
        city,
        state, 
        id: { [Op.not]: route.id },
        delivery_firm_id: route.delivery_firm_id,  
        deleted_at: { [Op.is]: null } 
      } 
    });
    return res !== null;
  },
  
  get(id) {
    return Route.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null },
        '$delivery_route_weights.deleted_at$': { [Op.is]: null },
        '$delivery_route_durations.deleted_at$': { [Op.is]: null }
      },
      include: [
        {
          model: DeliveryFirm,
          attributes: ['id'],
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: RouteWeight
        },
        {
          model: RouteDuration
        }
      ]
    });
  },

  async getListByDeliveryFirm(deliveryFirm, offset, limit) {
    
    const { count, rows } = await Route.findAndCountAll({
      where: { 
        delivery_firm_id: deliveryFirm.id,
        deleted_at: { [Op.is]: null }
      },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });

    for (let [i, route] of rows.entries()) {
      let weight = await RouteWeight.findOne({
        attributes: ['id', 'price'],
        where: {
          route_id: route.id,
          deleted_at: { [Op.is]: null }
        },
        order: [['price', 'ASC']],
      });

      rows[i].setDataValue('route_weights', (weight === null ? [] : [weight]));
    }

    return { count, rows };
  },

  add({ state, city, door_delivery, isolated }, delivery_firm_id) {
    return Route.create({ delivery_firm_id, state, city, door_delivery, isolated });
  },

  update(route, { city, state, door_delivery, isolated }) {
    return Route.update({ city, state, door_delivery, isolated }, { where: { id: route.id } });
  },

  delete(route) {

    return sequelize.transaction(async (transaction)=> {

      const deleted_at = Date.now();

      return await Promise.all([
        Route.update(
          { deleted_at }, 
          { where: { id: route.id }, transaction }
        ),

        RouteWeight.update(
          { deleted_at }, 
          { where: { route_id: route.id, deleted_at: { [Op.is]: null } }, transaction }
        ),

        RouteDuration.update(
          { deleted_at }, 
          { where: { route_id: route.id, deleted_at: { [Op.is]: null } }, transaction }
        )
      ]);
    });
  },

  getListByCityAndState(state_1, state_2, city_1, city_2) {
    return Route.findAll({
      include: [
        {
          model: DeliveryFirm,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        }
      ],
      where: {
        '$delivery_firm.user.status$': User.STATUS_ACTIVE,
        deleted_at: { [Op.is]: null },
        // [Op.or]: [

        // ]
      }
    });
  }

};

