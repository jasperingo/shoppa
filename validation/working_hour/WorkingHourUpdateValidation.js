
const WorkingHour = require('../../models/WorkingHour');

const TIME_REGEX = /^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])?$/;

module.exports = {

  working_hours:  {
    isArray:  {
      bail: true,
      options: { min: 1, max: 7 },
      errorMessage: (value, { req })=> req.__('_error._form._field_required')
    },
    custom: {
      options: (value, { req })=> {

        const err = [];

        const invalidMessage =  req.__('_error._form._field_invalid');

        const openingErrorMessage = req.__('_error._form._opening_hour_is_gte');

        const invalidIDMessage = req.__('_error._form._id_invalid');

        let hourIDs = null;

        if (req.data.store !== undefined)
          hourIDs = req.data.store.user.working_hours.map(i=> i.id);
        
        if (req.data.deliveryFirm !== undefined)
          hourIDs = req.data.deliveryFirm.user.working_hours.map(i=> i.id);

        for (let [i, hour] of value.entries()) {
          if (typeof hour === 'object' && hour !== null) {

            if (hour.day === undefined || !WorkingHour.getDays().includes(hour.day))
              err.push({ name: 'day', message: invalidMessage, index: i });

            const openingCheck = hour.opening === undefined || !TIME_REGEX.test(hour.opening);

            if (openingCheck)
              err.push({ name: 'opening', message: invalidMessage, index: i });

            const closingCheck = hour.closing === undefined || !TIME_REGEX.test(hour.closing);

            if (closingCheck)
              err.push({ name: 'closing', message: invalidMessage, index: i });

            if (!closingCheck && !openingCheck) {
              const openArray = hour.opening.match(/\d{2}/g);
              const closeArray = hour.closing.match(/\d{2}/g);

              const d1 = new Date(2000, 0, 1, openArray[0], openArray[1]);
              const d2 = new Date(2000, 0, 1, closeArray[0], closeArray[1]);

              if (d1.getTime() >= d2.getTime())
                err.push({ name: 'opening', message: openingErrorMessage, index: i });
            }

            if (hourIDs !== null && hour.id !== undefined && !hourIDs.includes(hour.id))
              err.push({ name: 'id', message: invalidIDMessage, index: i });

          } else {
            err.push({ message: invalidMessage, index: i });
          }
        }

        if (err.length > 0) throw err;

        const errIndex = [];

        const duplicateMessage = req.__('_error._form._field_duplicated');

        for (let i = 0; i < value.length; i++) {
          for (let j = i; j < value.length-1; j++) {
            let v1 = value[i];
            let v2 = value[j+1];
            if (v1.day === v2.day) {
              
              if (!errIndex.includes(i)) {
                errIndex.push(i);
                err.push({ message: duplicateMessage, index: i });
              }
      
              if (!errIndex.includes(j+1)) {
                errIndex.push(j+1);
                err.push({ message: duplicateMessage, index: j+1 });
              }
            }
          }
        }

        if (err.length > 0) throw err;

        return true;
      }
    }
  }

};


