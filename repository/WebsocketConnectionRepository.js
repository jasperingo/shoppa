const WebsocketConnection = require("../models/WebsocketConnection");

module.exports = {

  getListByUser(id) {
    return WebsocketConnection.findAll({ 
      where: { user_id: id }
    });
  },
  
  create(user_id, socket_id) {
    return WebsocketConnection.create({ user_id, socket_id });
  },
  
  deleteBySocketId(socket_id) {
    return WebsocketConnection.destroy({ where: { socket_id } });
  }
};

