
const express = require('express');
const { checkSchema } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const AddressFetchMiddleware = require('../middlewares/fetch/AddressFetchMiddleware');
const AddressPermissionMiddleware = require('../middlewares/permissions/AddressPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const CustomerAddressAddValidation = require('../validation/address/CustomerAddressAddValidation');
const CustomerAddressUpdateValidation = require('../validation/address/CustomerAddressUpdateValidation');

const router = express.Router();

const controller = new AddressController();

router.post(
  '/add', 
  AuthMiddleware, 
  checkSchema(CustomerAddressAddValidation), 
  ValidationMiddleware(), 
  controller.add
);

router.put(
  '/:id(\\d+)/update',
  AddressFetchMiddleware, 
  AuthMiddleware, 
  AddressPermissionMiddleware, 
  checkSchema(CustomerAddressUpdateValidation), 
  ValidationMiddleware(), 
  controller.update
);

router.get(
  '/:id(\\d+)', 
  AddressFetchMiddleware, 
  AuthMiddleware, 
  AddressPermissionMiddleware, 
  controller.get
);

module.exports = router;

