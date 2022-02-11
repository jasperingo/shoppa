const { Op } = require("sequelize");
const Message = require("../models/Message");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  async getNumberOfUnreceivedMessagesByUser(receiver_id) {
    const number = await Message.count({ 
      where: { 
        receiver_id,
        delivery_status: Message.DELIVERY_STATUS_SENT 
      } 
    });
    return number ?? 0;
  },

  async getNumberOfUnreceivedMessagesByApplication() {
    const number = await Message.count({ 
      where: { 
        application: { [Op.not]: null },
        delivery_status: Message.DELIVERY_STATUS_SENT 
      } 
    });
    return number ?? 0;
  },

  create({ sender_id, receiver_id, application, content, delivery_status }) {
    return Message.create({
      sender_id, 
      receiver_id,
      application,
      content,
      delivery_status
    });
  }
  

};
