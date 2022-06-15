
const express = require('express');
const { checkSchema } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const AddressFetchMiddleware = require('../middlewares/fetch/AddressFetchMiddleware');
const AddressAddPermissionMiddleware = require('../middlewares/permissions/adddres/AddressAddPermissionMiddleware');
const AddressUpdatePermissionMiddleware = require('../middlewares/permissions/adddres/AddressUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const CustomerAddressAddValidation = require('../validation/address/CustomerAddressAddValidation');
const CustomerAddressDeleteValidation = require('../validation/address/CustomerAddressDeleteValidation');
const CustomerAddressUpdateValidation = require('../validation/address/CustomerAddressUpdateValidation');

const router = express.Router();

const controller = new AddressController();

router.post(
  '/create', 
  AuthMiddleware, 
  AddressAddPermissionMiddleware,
  checkSchema(CustomerAddressAddValidation), 
  ValidationMiddleware, 
  controller.add
);

router.put(
  '/:id(\\d+)/update',
  AddressFetchMiddleware, 
  AuthMiddleware, 
  AddressUpdatePermissionMiddleware, 
  checkSchema(CustomerAddressUpdateValidation), 
  ValidationMiddleware, 
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  AddressFetchMiddleware, 
  AuthMiddleware, 
  AddressUpdatePermissionMiddleware,
  checkSchema(CustomerAddressDeleteValidation), 
  ValidationMiddleware, 
  controller.delete
);

router.get(
  '/:id(\\d+)', 
  AddressFetchMiddleware, 
  AuthMiddleware, 
  AddressUpdatePermissionMiddleware, 
  controller.get
);

module.exports = router;

