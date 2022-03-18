const { Op } = require("sequelize");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const sequelize = require("./DB");

module.exports = {

  get(id) {
    return Message.findByPk(id);
  },

  async getNumberOfUnreceivedMessages(user_id) {

    const count = await Chat.findOne({
      where: {
        [Op.or]: [
          { member_one_id: user_id },
          { member_two_id: user_id }
        ]
      },
      attributes: [],
      include: {
        model: Message,
        attributes: [[sequelize.fn('COUNT', sequelize.col('messages.id')), 'count']],
        where: { 
          user_id: { [Op.not]: user_id },
          delivery_status: Message.DELIVERY_STATUS_SENT 
        } 
      }
    });

    return count?.messages?.[0]?.getDataValue('count') ?? 0;
  },

  getChat(one, two, transaction) {
    return Chat.findOne({ 
      where: {
        [Op.or]: [
          { 
            member_one_id: one, 
            member_two_id: two 
          },
          { 
            member_one_id: two, 
            member_two_id: one 
          }
        ]
      },
      transaction
    });
  },

  getListByMembers(one, two, lastDate, limit) {
    return sequelize.transaction(async (transaction)=> {
      
      const chat = await this.getChat(one, two, transaction);

      if (chat === null) return [];

      return Message.findAll({
        where: { 
          chat_id: chat.id,
          created_at: { [Op.lt]: lastDate }
        },
        order: [['created_at', 'DESC']],
        limit,
        transaction
      });
    });
  },

  create({ sender_id, receiver_id, content }) {
    return sequelize.transaction(async (transaction)=> {

      let chat = await this.getChat(sender_id, receiver_id, transaction);

      if (chat === null) {
        chat = await Chat.create({
          member_one_id: sender_id, 
          member_two_id: receiver_id,
        },
        { transaction });
      }

      const message = await Message.create({
        content,
        chat_id: chat.id,
        user_id: sender_id, 
        delivery_status: Message.DELIVERY_STATUS_SENT
      }, { transaction });

      await Chat.update(
        { last_message_id: message.id }, 
        { 
          where: { id: chat.id },
          transaction 
        }
      );

      return { chat, message };
    });
  },
  
  updateDeliveryStatus(userId, senderId) {
    return sequelize.transaction(async (transaction)=> {

      const chat = await this.getChat(userId, senderId, transaction);

      if (chat === null) return null;

      return Message.update({delivery_status: Message.DELIVERY_STATUS_DELIVERED}, { 
        where: {
          chat_id: chat.id,
          user_id: { [Op.not]: userId },
          delivery_status: Message.DELIVERY_STATUS_SENT
        },
        transaction
      });
    });
  }
  
};
