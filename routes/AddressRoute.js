
const express = require('express');
const { checkSchema } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const PermissionMiddleware = require('../middlewares/PermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const CustomerAddressAddValidation = require('../validation/address/CustomerAddressAddValidation');
const CustomerAddressUpdateValidation = require('../validation/address/CustomerAddressUpdateValidation');

const router = express.Router();

const controller = new AddressController();

router.post('/add', AuthMiddleware, PermissionMiddleware.permit(), checkSchema(CustomerAddressAddValidation), ValidationMiddleware(), controller.add);

router.put('/:id/update', AuthMiddleware, checkSchema(CustomerAddressUpdateValidation), ValidationMiddleware(), controller.update);

router.get('/:id', AuthMiddleware, controller.get);

module.exports = router;

