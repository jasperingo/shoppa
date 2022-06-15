const { Op } = require("sequelize");
const User = require("../models/User");
const WorkingHour = require("../models/WorkingHour");
const sequelize = require("./DB");


module.exports = {

  addOrUpdate(user, hours) {
    return sequelize.transaction(async (transaction)=> {

      const IDs = [];

      for (let { id, day, opening, closing } of hours) {

        if (id === undefined) {
          const hour = await WorkingHour.create({ user_id: user.id, day, opening, closing }, { transaction });
          IDs.push(hour.id);
        } else {
          IDs.push(id);
          await WorkingHour.update({ day, opening, closing }, { where: { id }, transaction });
        }
      }

      await WorkingHour.destroy({ 
        where: {
          user_id: user.id,
          id: {
            [Op.notIn]: IDs
          }
        },
        transaction
      });

      if (user.status === User.STATUS_ACTIVATING && user.addresses.length > 0) {
        await User.update({ status: User.STATUS_ACTIVE }, { where : { id: user.id }, transaction });
      }

    });
  },

};

