
const Locations = require('naija-state-local-government');

module.exports = {

  getList() {
    const locations = Locations.all();

    locations.map(i=> {
      i.senatorial_districts = undefined;
      return i;
    });

    return locations;
  },

  getStates() {
    return Locations.states();
  },

  getState(state) {
    return Locations.lgas(state);
  },

  getCities(state) {
    const state = Locations.lgas(state);
    return state ? state.lgas : [];
  }

};

