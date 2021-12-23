
const jwt = require('jsonwebtoken');

const AUTH_CUSTOMER = 'CUSTOMER';
const AUTH_ADMIN = 'ADMIN';

function signCustomerJWT(payload) {
  payload.authType = AUTH_CUSTOMER;
  return signJWT(payload);
}

function signAdminJWT(payload) {
  payload.authType = AUTH_ADMIN;
  return signJWT(payload);
}

function signJWT(payload) {

  const expiring_date = getJWTExpiringDate();
  payload.exp = expiring_date;

  return new Promise((resolve, reject)=> {
    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token)=> {
      if (err) reject(err);
      else resolve({
        token,
        expiring_date,
        type: 'jwt'
      });
    });
  });
}

function getJWTExpiringDate() {
  return Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30);
}

function verifyJWT(token) {
  return new Promise((resolve, reject)=> {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

module.exports = { signCustomerJWT, signAdminJWT, getJWTExpiringDate, verifyJWT, AUTH_ADMIN, AUTH_CUSTOMER };
