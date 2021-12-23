const ForbiddenException = require("../http/exceptions/ForbiddenException");
const { AUTH_ADMIN, AUTH_CUSTOMER } = require("../security/JWT");

const STORE = 'STORE';
const DELIVERY_FIRM = 'DELIVERY_FIRM';

function permit(to) {

  return (req, res, next)=> {

    const ID = to ? (req.auth[to] ? req.auth[to].id : -1) : req.auth.id;

    if (req.auth.authType === AUTH_ADMIN && req.auth.type === 'app') {
      next();
    } else if (req.auth.authType === AUTH_CUSTOMER && ID === parseInt(req.params.id)) {
      next();
    } else {
      next(new ForbiddenException());
    }
  }
}

module.exports = { STORE, DELIVERY_FIRM, permit };

