const UnauthorizedException = require("../http/exceptions/UnauthorizedException");
const { verifyJWT } = require("../security/JWT");

module.exports = async (req, res, next)=> {

  try {
    
    const header = req.get('Authorization');

    if (!header) throw Error('No authorization header')

    const token = header.substring('bearer'.length+1);

    const auth = await verifyJWT(token);

    req.auth = auth;

    next();

  } catch (error) {
    next(new UnauthorizedException(error));
  }
};

