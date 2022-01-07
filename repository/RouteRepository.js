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

  async routeExists(delivery_firm_id, { location_1_state, location_2_state, location_1_city, location_2_city }) {
    
    const where = { delivery_firm_id, location_1_state, location_2_state, deleted_at: { [Op.is]: null } };

    if (location_1_city !== undefined && location_2_city !== undefined && location_1_city !== null && location_2_city !== null) {
      where.location_1_city = location_1_city;
      where.location_2_city = location_2_city;
    }
    
    const route = await Route.findOne({ where });
    return route !== null;
  },

  async updateRouteExists(delivery_firm_id, { location_1_state, location_2_state, location_1_city, location_2_city }, id) {

    const where = { delivery_firm_id, location_1_state, location_2_state, deleted_at: { [Op.is]: null }, [Op.not]: { id } };

    if (location_1_city !== undefined && location_2_city !== undefined && location_1_city !== null && location_2_city !== null) {
      where.location_1_city = location_1_city;
      where.location_2_city = location_2_city;
    }

    const route = await Route.findOne({ where });
    return route !== null;
  },
  
  get(id) {
    return Route.findOne({
      where: { 
        id,
        deleted_at: { [Op.is]: null },
        '$route_weights.deleted_at$': { [Op.is]: null },
        '$route_durations.deleted_at$': { [Op.is]: null }
      },
      include: [
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

  add({ delivery_firm_id, location_1_state, location_2_state, location_1_city, location_2_city }) {
    
    const values = { delivery_firm_id, location_1_state, location_2_state };

    if (location_1_city !== undefined && location_2_city !== undefined && location_1_city !== null && location_2_city !== null) {
      values.location_1_city = location_1_city;
      values.location_2_city = location_2_city;
    }

    return Route.create(values);
  },

  update(route, { location_1_state, location_2_state, location_1_city, location_2_city }) {
    
    const values = { location_1_state, location_2_state };

    if (location_1_city !== undefined && location_2_city !== undefined && location_1_city !== null && location_2_city !== null) {
      values.location_1_city = location_1_city;
      values.location_2_city = location_2_city;
    }

    return Route.update(values, { where: { id: route.id } });
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
      include: {
        model: DeliveryFirm,
        include: {
          model: User,
          attributes: User.GET_ATTR
        }
      },
      where: {
        '$delivery_firm.user.status$': User.STATUS_ACTIVE,
        deleted_at: { [Op.is]: null },
        [Op.or]: [

          { 
            location_1_state: state_1,
            location_2_state: state_2,
            [Op.or]: [
              {
                location_1_city: city_1,
                location_2_city: city_2,
              },
              {
                location_1_city: { [Op.is]: null },
                location_2_city: { [Op.is]: null }
              }
            ]
          },

          { 
            location_1_state: state_2,
            location_2_state: state_1,
            [Op.or]: [
              {
                location_1_city: city_2,
                location_2_city: city_1,
              },
              {
                location_1_city: { [Op.is]: null },
                location_2_city: { [Op.is]: null }
              }
            ]
          }
        ]
      }
    });
  }

};

