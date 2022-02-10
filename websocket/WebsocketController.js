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
  
    return (socket)=> {

      if (socket.request.auth.authType === JWT.AUTH_APP_ADMIN) {
        this.USERS.push({ id: 'application', socketId: socket.id });
      } else {
        this.USERS.push({ id: socket.request.auth.userId, socketId: socket.id });
      }
      
      socket.on('message', (receiverId, message)=> {
        
        const user = this.USERS.find(i=> i.id === Number(receiverId) || i.id === receiverId);
        
        if (user) {
          socket.to(user.socketId).emit('message', message);
          socket.emit('message_created', true);
        }
      });

      socket.on('get_users', async (last_date, page_limit)=> {
        
        
      });

      socket.on('get_messages', async (userId)=> {
        
        
      });
    
      socket.on('disconnect', ()=> {
        this.USERS = this.USERS.filter(i=> i.id !== socket.request.auth.userId);
      });

      //console.log(`Web socket connected on ${socket.request.auth.userId}`);
    }
  }

}

