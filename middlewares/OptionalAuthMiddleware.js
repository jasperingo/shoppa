const JWT = require("../security/JWT");

module.exports = async (req, res, next)=> {

  try {
    
    const header = req.get('Authorization');

    if (header) {

      const token = header.substring('bearer'.length+1);

      const auth = await JWT.verifyJWT(token);

      req.auth = auth;
    }

  } catch {

  } finally {
    next();
  }
};

