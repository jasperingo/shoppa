const { Op } = require("sequelize");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const sequelize = require("./DB");

module.exports = {

  get(id) {
    return Chat.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'photo', 'type'],
          as: 'member_one'
        },
        {
          model: User,
          attributes: ['id', 'name', 'photo', 'type'],
          as: 'member_two'
        }
      ],
    });
  },

  getByMembers(one, two) {
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
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'photo', 'type'],
          as: 'member_one'
        },
        {
          model: User,
          attributes: ['id', 'name', 'photo', 'type'],
          as: 'member_two'
        }
      ],
    });
  },

  getListByMember(id, date, limit) {
    return sequelize.transaction(async (transaction)=> {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { member_one_id: id },
            { member_two_id: id }
          ],
        },
        include: [
          {
            model: Message,
            where: {
              created_at: { [Op.lt]: date }
            },
          },
          {
            model: User,
            attributes: ['id', 'name', 'photo', 'type'],
            as: 'member_one'
          },
          {
            model: User,
            attributes: ['id', 'name', 'photo', 'type'],
            as: 'member_two'
          }
        ],
        order: [[Message, 'created_at', 'DESC']],
        limit,
        transaction
      });

      for (const chat of chats) {
        const message = await Message.findOne({
          where: { chat_id: chat.id },
          order: [['created_at', 'DESC']],
          transaction
        });

        chat.setDataValue('messages', [message])
      }

      return chats;
    });
  }

};

