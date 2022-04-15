const { Op } = require("sequelize");
const DeliveryFirm = require("../models/DeliveryFirm");
const Route = require("../models/Route");
const RouteLocation = require("../models/RouteLocation");
const RouteWeight = require("../models/RouteWeight");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async existsById(id) {
    const res = await Route.findOne({ attributes: ['id'], where: { id } });
    return res !== null;
  },

  async existsByIdAndDeliveryFirmId(id, delivery_firm_id) {
    const route = await Route.findOne({ attributes: ['id'], where: { id, delivery_firm_id } });
    return route !== null;
  },

  async existsByNameAndDeliveryFirmId(name, delivery_firm_id) {
    const res = await Route.findOne({ attributes: ['id'], where: { name, delivery_firm_id } });
    return res !== null;
  },

  async existsByNameAndDeliveryFirmIdAndNotId(name, delivery_firm_id, id) {
    const res = await Route.findOne({ 
      attributes: ['id'], 
      where: {
        name, 
        delivery_firm_id,
        [Op.not]: { id }
      } 
    });
    return res !== null;
  }, 

  getListByLocationCityAndState(state1, city1, state2,  city2) {
    return Route.findAll({
      include: [
        {
          model: DeliveryFirm,
          include: {
            model: User,
            attributes: User.GET_ATTR
          }
        },
        {
          model: RouteLocation,
          where: {
            state: {
              [Op.or]: [state1, state2]
            },
            city: {
              [Op.or]: [city1, city2]
            } 
          }
        }
      ],
      where: { '$delivery_firm.user.status$': User.STATUS_ACTIVE }
    });
  },
  
  get(id) {
    return Route.findOne({
      where: { id },
      include: [
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
          model: RouteLocation
        }
      ]
    });
  },

  async getListByDeliveryFirm(deliveryFirm, offset, limit) {
    
    const { count, rows } = await Route.findAndCountAll({
      where: { delivery_firm_id: deliveryFirm.id },
      order: [['created_at', 'DESC']],
      offset,
      limit
    });

    for (const route of rows) {
      const weight = await RouteWeight.findOne({
        attributes: ['id', 'fee'],
        where: { delivery_route_id: route.id },
        order: [['fee', 'ASC']],
      });

      route.setDataValue('route_weights', (weight === null ? [] : [weight]));
    }

    return { count, rows };
  },
  

  add({ name, door_delivery }, delivery_firm_id) {
    return Route.create({ delivery_firm_id, name, door_delivery });
  },

  update(route, { name, door_delivery }) {
    return Route.update({ name, door_delivery }, { where: { id: route.id } });
  },

  delete(route) {
    return sequelize.transaction(async (transaction)=> {
      return await Promise.all([
        Route.destroy({ where: { id: route.id }, transaction }),
        RouteWeight.destroy({ where: { delivery_route_id: route.id }, transaction }),
        RouteLocation.destroy({ where: { delivery_route_id: route.id }, transaction })
      ]);
    });
  }

};
