
const jwt = require('jsonwebtoken');

const AUTH_CUSTOMER = 'CUSTOMER';
const AUTH_APP_ADMIN = 'APP_ADMIN';
const AUTH_STORE_ADMIN = 'STORE_ADMIN';
const AUTH_DELIVERY_ADMIN = 'DELIVERY_ADMIN';

function signCustomerJWT(customer) {
  return signJWT({
    customerId : customer.id,
    userId: customer.user.id,
    authType: AUTH_CUSTOMER
  });
}

function signAdminJWT(admin) {
  return signJWT({
    adminId : admin.id,
    adminRole: admin.role,
    adminType: admin.type,
    authType: AUTH_APP_ADMIN,
    userId: admin.application.id
  });
}

function signStoreJWT(store) {
  const admin = store.administrators[0];
  return signJWT({
    adminId : admin.id,
    adminRole: admin.role,
    adminType: admin.type,
    authType: AUTH_STORE_ADMIN,
    storeId: store.id,
    userId: store.user.id
  });
}

function signDeliveryFirmJWT(delivery) {
  const admin = delivery.administrators[0];
  return signJWT({
    adminId : admin.id,
    adminRole: admin.role,
    adminType: admin.type,
    authType: AUTH_DELIVERY_ADMIN,
    deliveryFirmId: delivery.id,
    userId: delivery.user.id
  });
}

function signJWT(payload) {

  const { expiring_timestamp, expiring_date } = getJWTExpiringDate();
  
  payload.exp = expiring_timestamp;

  return new Promise((resolve, reject)=> {
    jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token)=> {
      if (err) reject(err);
      else resolve({
        token,
        expiring_timestamp,
        expiring_date,
        type: 'Bearer'
      });
    });
  });
}

function getJWTExpiringDate() {
  const date = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)); // 30 days
  const unix = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days
  return { expiring_timestamp: unix, expiring_date: date.toDateString() };
}

function verifyJWT(token) {
  return new Promise((resolve, reject)=> {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

module.exports = { 
  signCustomerJWT, 
  signAdminJWT, 
  signStoreJWT,
  signDeliveryFirmJWT,
  getJWTExpiringDate, 
  verifyJWT, 
  AUTH_APP_ADMIN, 
  AUTH_CUSTOMER,
  AUTH_STORE_ADMIN,
  AUTH_DELIVERY_ADMIN
};
