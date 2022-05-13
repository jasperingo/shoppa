const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const ChatRepository = require("../repository/ChatRepository");
const MessageRepository = require("../repository/MessageRepository");
const WebsocketConnectionRepository = require("../repository/WebsocketConnectionRepository");
const { encrypt, decrypt } = require("../security/Encrypt");

module.exports = class MessageController {

  getTimeOffset(lastDate) {
    const date = new Date(lastDate);
    // date.setHours(date.getHours()+1);
    // console.log(date);
    return (date.getFullYear() < new Date().getFullYear()) || isNaN(date.getTime()) ? new Date() : date.toISOString();
  }

  getPageLimit(pageLimit) {
    return isNaN(Number(pageLimit)) || Number(pageLimit) < 1 ? Pagination.LIMIT : Number(pageLimit);
  }

  async getNumberOfUnreceivedMessages(socket) {
    try {
      const count = await MessageRepository.getNumberOfUnreceivedMessages(socket.request.auth.userId);
      socket.emit('unreceived_messages_count', ResponseDTO.success(ResponseDTO.SUCCESS, { count }));
    } catch(error) {
      socket.emit('unreceived_messages_count', ResponseDTO.error(ResponseDTO.ERROR));
    }
  }

  async sendMessage(socket, receiverId, content) {
    try {
      if (content === '')
        throw new Error();

      content = encrypt(content);
      
      const users = await WebsocketConnectionRepository.getListByUser(receiverId);

      const result = await MessageRepository.create({ 
        content,
        receiver_id: Number(receiverId),
        sender_id: socket.request.auth.userId,
      });

      const message = await MessageRepository.get(result.message.id);

      message.content = decrypt(message.content);

      const chat = await ChatRepository.get(result.chat.id);

      chat.setDataValue('messages', [message]);

      const response = ResponseDTO.success(ResponseDTO.SUCCESS, chat);

      socket.emit('message_created', response);

      if (users.length > 0)
        socket.to(users.map(i=> i.socket_id)).emit('message', response);

    } catch {
      socket.emit('message_created', ResponseDTO.error(ResponseDTO.ERROR));
    }
  }

  async getMessageRecipient(socket, memberId) {
    
    try {
      
      const recipient = await ChatRepository.getByMembers(
        socket.request.auth.userId, memberId
      );
      
      const reponse = ResponseDTO.success(ResponseDTO.SUCCESS, recipient);

      socket.emit('message_recipient', reponse);
      
    } catch(error) {
      socket.emit('message_recipient', ResponseDTO.error(ResponseDTO.ERROR));
    }
  }

  async getMessageRecipients(socket, lastDate, pageLimit) {
    
    try {
      
      const result = await ChatRepository.getListByMember(
        socket.request.auth.userId,
        this.getTimeOffset(lastDate),
        this.getPageLimit(pageLimit)
      );
      
      const recipients = result.map(chat => {
        const content = chat.messages[0].content;
        chat.messages[0].content = content ? decrypt(content) : content;
        return chat;
      });
      
      const reponse = ResponseDTO.success(ResponseDTO.SUCCESS, recipients);

      socket.emit('message_recipients', reponse);
      
    } catch(error) {
      console.log(error)
      socket.emit('message_recipients', ResponseDTO.error(ResponseDTO.ERROR));
    }
  }

  async updateDeliveryStatus(socket, memberId) {

    try {
      
      await MessageRepository.updateDeliveryStatus(socket.request.auth.userId, memberId);

    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(socket, memberId, lastDate, pageLimit) {

    try {
      
      const result = await MessageRepository.getListByMembers(
        memberId,
        socket.request.auth.userId,
        this.getTimeOffset(lastDate),
        this.getPageLimit(pageLimit)
      );
      
      const messages = result.map(message => { 
        const content = message.content;
        message.content = content ? decrypt(content) : content;
        return message;
      });

      const response = ResponseDTO.success(ResponseDTO.SUCCESS, messages);

      socket.emit('messages', response);
      
    } catch(error) {
      console.log(error)
      socket.emit('messages', ResponseDTO.error(ResponseDTO.ERROR));
    }
  }

  async getApplicationSupport(socket) {

    try {
      
      const recipient = await ChatRepository.getByMemberWithApplicationSupport(socket.request.auth.userId);
      
      const reponse = ResponseDTO.success(ResponseDTO.SUCCESS, recipient);

      socket.emit('application_support', reponse);
      
    } catch(error) {
      socket.emit('application_support', ResponseDTO.error(ResponseDTO.ERROR));
    }
  }

}
