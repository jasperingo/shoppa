const { Op } = require("sequelize");
const DeliveryFirm = require("../models/DeliveryFirm");
const Route = require("../models/Route");
const RouteDuration = require("../models/RouteDuration");
const RouteWeight = require("../models/RouteWeight");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async idExists(id) {
    const res = await Route.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

  async idExistsForDeliveryFirm(id, delivery_firm_id) {
    const route = await Route.findOne({ attributes: ['id'], where: { id, delivery_firm_id } });
    return route !== null;
  },

  async idExistsForLink(id) {
    const res = await Route.findOne({ 
      attributes: ['id'],
      where: { 
        id, 
        origin_route_id: { [Op.not]: null },
        destination_route_id: { [Op.not]: null }
      } 
    });
    return res !== null;
  },

  async routeExists(delivery_firm_id, { state, city }) {
    const route = await Route.findOne({ 
      attributes: ['id'],
      where: { delivery_firm_id, state, city } 
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
        delivery_firm_id: route.delivery_firm_id
      } 
    });
    return res !== null;
  },

  async linkRouteExists(delivery_firm_id, { origin_route_id, destination_route_id }) {
    const route = await Route.findOne({ 
      attributes: ['id'],
      where: { 
        delivery_firm_id,
        [Op.or]: [
          { origin_route_id, destination_route_id },
          { origin_route_id: destination_route_id, destination_route_id: origin_route_id }
        ]
      } 
    });
    return route !== null;
  },

  async updateLinkRouteExists(route, { origin_route_id, destination_route_id }) {
    const res = await Route.findOne({ 
      attributes: ['id'],
      where: { 
        id: { [Op.not]: route.id },
        delivery_firm_id: route.delivery_firm_id,
        [Op.or]: [
          { origin_route_id, destination_route_id },
          { origin_route_id: destination_route_id, destination_route_id: origin_route_id }
        ]
      } 
    });
    return res !== null;
  },
  
  get(id) {
    return Route.findOne({
      where: { id },
      include: [
        {
          model: Route,
          as: 'origin_route',
        },
        {
          model: Route,
          as: 'destination_route',
        },
        {
          model: DeliveryFirm,
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
      where: { delivery_firm_id: deliveryFirm.id },
      include: [
        {
          model: Route,
          as: 'origin_route',
        },
        {
          model: Route,
          as: 'destination_route',
        },
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit
    });

    for (let [i, route] of rows.entries()) {
      let weight = await RouteWeight.findOne({
        attributes: ['id', 'fee'],
        where: { delivery_route_id: route.id },
        order: [['fee', 'ASC']],
      });

      rows[i].setDataValue('route_weights', (weight === null ? [] : [weight]));
    }

    return { count, rows };
  },

  async getListOfBaseByDeliveryFirm(deliveryFirm, offset, limit) {
    
    return await Route.findAndCountAll({
      where: { 
        origin_route_id: { [Op.is]: null },
        destination_route_id: { [Op.is]: null },
        delivery_firm_id: deliveryFirm.id,
      },
      include: [
        {
          model: Route,
          as: 'origin_route',
        },
        {
          model: Route,
          as: 'destination_route',
        },
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit
    });
  },

  add({ state, city, door_delivery }, delivery_firm_id) {
    return Route.create({ delivery_firm_id, state, city, door_delivery });
  },

  createLink({ origin_route_id, destination_route_id }, delivery_firm_id) {
    return Route.create({ delivery_firm_id, origin_route_id, destination_route_id });
  },

  update(route, { city, state, door_delivery }) {
    return Route.update({ city, state, door_delivery }, { where: { id: route.id } });
  },

  updateLink(route, { origin_route_id, destination_route_id }) {
    return Route.update({ origin_route_id, destination_route_id }, { where: { id: route.id } });
  },

  delete(route) {
    return sequelize.transaction(async (transaction)=> {
      return await Promise.all([
        Route.destroy({ 
          where: { 
            [Op.or]: [
              { id: route.id },
              { origin_route_id: route.id },
              { destination_route_id: route.id }
            ]
          }, 
          transaction 
        }),
        RouteWeight.destroy({ where: { delivery_route_id: route.id }, transaction }),
        RouteDuration.destroy({ where: { delivery_route_id: route.id }, transaction })
      ]);
    });
  },

  getListByTwoCityAndState(state1, city1, state2,  city2) {
    return Route.findAll({
      include: [
        {
          model: Route,
          as: 'origin_route',
        },
        {
          model: Route,
          as: 'destination_route',
        },
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
        [Op.or]: [
          {
            state: {
              [Op.and]: [state1, state2]
            },
            city: {
              [Op.and]: [city1, city2]
            }
          },
         {
          [Op.or]: [
            {
              '$origin_route.state$': state1,
              '$origin_route.city$': city1,
              '$destination_route.state$': state2,
              '$destination_route.city$': city2,
            },
            {
              '$origin_route.state$': state2,
              '$origin_route.city$': city2,
              '$destination_route.state$': state1,
              '$destination_route.city$': city1,
            },
          ]
         }
        ]
      }
    });
  }

};

