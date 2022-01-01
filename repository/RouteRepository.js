const { Op } = require("sequelize");
const Route = require("../models/Route");
const RouteDuration = require("../models/RouteDuration");
const RouteWeight = require("../models/RouteWeight");
const sequelize = require("./DB");

module.exports = {

  async routeExists(delivery_firm_id, { location_1_state, location_2_state, location_1_city, location_2_city }) {
    
    const where = location_1_city ? 
                    { delivery_firm_id, location_1_state, location_2_state, location_1_city, location_2_city } : 
                    { delivery_firm_id, location_1_state, location_2_state };

    const route = await Route.findOne({ where });
    return route !== null;
  },

  async updateRouteExists(delivery_firm_id, { location_1_state, location_2_state, location_1_city, location_2_city }, id) {
    
    const where = location_1_city ? 
                    { delivery_firm_id, location_1_state, location_2_state, location_1_city, location_2_city, [Op.not]: { id } } : 
                    { delivery_firm_id, location_1_state, location_2_state, [Op.not]: { id } };

    const route = await Route.findOne({ where });
    return route !== null;
  },

  get(id) {
    return Route.findOne({
      where: { id },
      include: [
        {
          model: RouteWeight,
          where: {
            deleted_at: {
              [Op.is]: null
            }
          }
        },
        {
          model: RouteDuration,
          where: {
            deleted_at: {
              [Op.is]: null
            }
          }
        }
      ]
    });
  },

  add({ delivery_firm_id, location_1_state, location_2_state, location_1_city, location_2_city, route_weights, route_durations }) {
    return sequelize.transaction(async (transaction)=> {

      const values = location_1_city ? 
                    { delivery_firm_id, location_1_state, location_2_state, location_1_city, location_2_city } : 
                    { delivery_firm_id, location_1_state, location_2_state };

      const route = await Route.create(values, { transaction });

      for (let { minimium, maximium, price } of route_weights) {
        await RouteWeight.create(
          { route_id: route.id, minimium, maximium, price },
          { transaction }
        );
      }

      for (let { minimium, maximium, fee, unit } of route_durations) {
        await RouteDuration.create(
          { route_id: route.id, minimium, maximium, fee, unit },
          { transaction }
        );
      }

      return route;
    });
  },

  update(route, { location_1_state, location_2_state, location_1_city, location_2_city, route_weights, route_durations }) {
    return sequelize.transaction(async (transaction)=> {

      const values = location_1_city ? 
                    { location_1_state, location_2_state, location_1_city, location_2_city } : 
                    { location_1_state, location_2_state };

      const result = await Route.update(values, { where: { id: route.id }, transaction });

      const weightIDs = [];

      const durationIDs = [];

      for (let { id, minimium, maximium, price } of route_weights) {
        if (id === undefined) {
          let weight = await RouteWeight.create(
            { route_id: route.id, minimium, maximium, price },
            { transaction }
          );
          weightIDs.push(weight.id);
        } else {
          weightIDs.push(id);
          await RouteWeight.update(
            { minimium, maximium, price },
            { where: { id }, transaction }
          );
        }
      }

      for (let { id, minimium, maximium, fee, unit } of route_durations) {
        if (id === undefined) {
          let duration = await RouteDuration.create(
            { route_id: route.id, minimium, maximium, fee, unit },
            { transaction }
          );
          durationIDs.push(duration.id);
        } else {
          durationIDs.push(id);
          await RouteDuration.update(
            { minimium, maximium, fee, unit },
            { where: { id }, transaction }
          );
        }
      }

      await Promise.all([
        RouteWeight.update({ deleted_at: Date.now() }, { 
          where: { 
            route_id: route.id, 
            id: {
              [Op.notIn]: weightIDs
            }
          },
          transaction
        }),

        RouteDuration.update({ deleted_at: Date.now() }, { 
          where: { 
            route_id: route.id, 
            id: {
              [Op.notIn]: durationIDs
            }
          },
          transaction
        })
      ]);

      return result;
    });
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
          { where: { route_id: route.id }, transaction }
        ),

        RouteDuration.update(
          { deleted_at }, 
          { where: { route_id: route.id }, transaction }
        )
      ]);
    });
  }

};

