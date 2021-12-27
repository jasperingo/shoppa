const User = require("../models/User");
const WorkingHour = require("../models/WorkingHour");
const sequelize = require("./DB");


module.exports = {

  addOrUpdate(user, hours) {
    return sequelize.transaction(async ()=> {

      for (let { day, opening, closing } of hours) {
        
        let hour = await WorkingHour.findOne({ where: { day, user_id: user.id } });

        if (hour === null) {
          await WorkingHour.create({ user_id: user.id, day, opening, closing });
        } else {
          await WorkingHour.update({ day, opening, closing }, { where: { id: hour.id }});
        }
      }

      if (user.status === User.STATUS_ACTIVATING && user.addresses.length > 0) {
        await User.update({ status: User.STATUS_ACTIVE }, { where : { id: user.id } });
      }

    });
  },

};

