const Message = require("../models/Message");
const MessageRepository = require("../repository/MessageRepository");
const JWT = require("../security/JWT");

module.exports = {

  IO: null,

  USERS: [],

  setIO(IO) {
    this.IO = IO;
    return this;
  },

  middlewares() {

    this.IO.use(async (socket, next)=> {
      try {
        const header = socket.request.headers.authorization;
        if (!header) throw Error('No authorization header');
        const token = header.substring('bearer'.length+1);
        const auth = await JWT.verifyJWT(token);
        socket.request.auth = auth;
        next();
      } catch(err) {
        next(err);
      }
    });

    return this;
  },

  connect() {
  
    return async (socket)=> {

      if (socket.request.auth.authType === JWT.AUTH_APP_ADMIN) {
        this.USERS.push({ id: 'application', socketId: socket.id });
        const count = await MessageRepository.getNumberOfUnreceivedMessagesByApplication();
        socket.emit('unreceived_messages_count', { count });
      } else {
        this.USERS.push({ id: socket.request.auth.userId, socketId: socket.id });
        const count = await MessageRepository.getNumberOfUnreceivedMessagesByUser(socket.request.auth.userId);
        socket.emit('unreceived_messages_count', { count });
      }
      
      socket.on('message', async (receiverId, application, content)=> {

        application = Boolean(application);
        
        const user = this.USERS.find(i=> i.id === Number(receiverId) || i.id === 'application');

        const message = await MessageRepository.create({ 
          content,
          receiver_id: application === true ? undefined : receiverId,
          sender_id: socket.request.auth.authType === JWT.AUTH_APP_ADMIN ? undefined : socket.request.auth.userId,
          delivery_status: user !== undefined ? Message.DELIVERY_STATUS_DELIVERED: Message.DELIVERY_STATUS_SENT,
          application: socket.request.auth.authType === JWT.AUTH_APP_ADMIN ? 
            Message.APPLICATION_ROLE_SENDER : 
            (application === true ? Message.APPLICATION_ROLE_RECEIVER : undefined),
        });

        socket.emit('message_created', message);

        if (user) {
          socket.to(user.socketId).emit('message', message);
        }
      });

      socket.on('get_users', async (last_date, page_limit)=> {
        
        
      });

      socket.on('get_messages', async (userId, application)=> {
        
        
      });
    
      socket.on('disconnect', ()=> {
        this.USERS = this.USERS.filter(i=> i.id !== socket.request.auth.userId);
      });

      //console.log(`Web socket connected on ${socket.request.auth.userId}`);
    }
  }

}

