
const WorkingHour = require('../../models/WorkingHour');

const DAYS = [
  WorkingHour.DAY_SUNDAY, 
  WorkingHour.DAY_MONDAY, 
  WorkingHour.DAY_TUESDAY, 
  WorkingHour.DAY_WEDNESDAY, 
  WorkingHour.DAY_THURSDAY,
  WorkingHour.DAY_FRIDAY,
  WorkingHour.DAY_SATURDAY
];

const TIME_REGEX = /^[0-2][0-9]:[0-5][0-9]$/;

module.exports = {

  working_hours: {
    isArray: {
      bail: true,
      errorMessage: (value, { req })=> req.__('_error._form._field_required')
    },
    custom: {
      options: (value, { req })=> {
        if (value.length === 0)
          throw req.__('_error._form._field_invalid');
        else 
          return true;
      }
    }
  },

  'working_hours.*.day': {
    isIn: {
      options: [DAYS],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    },
  },

  'working_hours.*.opening': {
    matches: {
      options: [TIME_REGEX],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  },

  'working_hours.*.closing': {
    matches: {
      options: [TIME_REGEX],
      errorMessage: (value, { req })=> req.__('_error._form._field_invalid')
    }
  }

};


