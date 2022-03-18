const Pagination = require("../http/Pagination");
const Response = require("../http/Response");
const ChatRepository = require("../repository/ChatRepository");
const MessageRepository = require("../repository/MessageRepository");
const WebsocketConnectionRepository = require("../repository/WebsocketConnectionRepository");

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
      socket.emit('unreceived_messages_count', new Response(Response.SUCCESS, Response.SUCCESS, { count }));
    } catch(error) {
      console.log(error);
      socket.emit('unreceived_messages_count', new Response(Response.ERROR, Response.ERROR));
    }
  }

  async sendMessage(socket, receiverId, content) {
    try {
      if (content === '')
        throw new Error();
      
      const users = await WebsocketConnectionRepository.getListByUser(receiverId);

      const result = await MessageRepository.create({ 
        content,
        receiver_id: Number(receiverId),
        sender_id: socket.request.auth.userId,
      });

      const message = await MessageRepository.get(result.message.id);

      const chat = await ChatRepository.get(result.chat.id);

      chat.setDataValue('messages', [message]);

      const reponse = new Response(Response.SUCCESS, Response.SUCCESS, chat);

      socket.emit('message_created', reponse);

      socket.to(users.map(i=> i.socket_id)).emit('message', reponse);

    } catch {
      socket.emit('message_created', new Response(Response.ERROR, Response.ERROR));
    }
  }

  async getMessageRecipient(socket, memberId) {
    
    try {
      
      const recipient = await ChatRepository.getByMembers(
        socket.request.auth.userId, memberId
      );
      
      const reponse = new Response(Response.SUCCESS, Response.SUCCESS, recipient);

      socket.emit('message_recipient', reponse);
      
    } catch(error) {
      console.log(error);
      socket.emit('message_recipient', new Response(Response.ERROR, Response.ERROR));
    }
  }

  async getMessageRecipients(socket, lastDate, pageLimit) {
    
    try {
      
      const recipients = await ChatRepository.getListByMember(
        socket.request.auth.userId,
        this.getTimeOffset(lastDate),
        this.getPageLimit(pageLimit)
      );
      
      const reponse = new Response(Response.SUCCESS, Response.SUCCESS, recipients);

      socket.emit('message_recipients', reponse);
      
    } catch(error) {
      console.log(error);
      socket.emit('message_recipients', new Response(Response.ERROR, Response.ERROR));
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
      
      const messages = await MessageRepository.getListByMembers(
        memberId,
        socket.request.auth.userId,
        this.getTimeOffset(lastDate),
        this.getPageLimit(pageLimit)
      );
      
      const reponse = new Response(Response.SUCCESS, Response.SUCCESS, messages);

      socket.emit('messages', reponse);
      
    } catch(error) {
      console.log(error);
      socket.emit('messages', new Response(Response.ERROR, Response.ERROR));
    }
  }


}
