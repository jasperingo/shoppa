
const express = require('express');
const { checkSchema } = require('express-validator');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const PermissionMiddleware = require('../middlewares/PermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const CustomerLoginValidation = require('../validation/customer/CustomerLoginValidation');
const CustomerRegistration = require('../validation/customer/CustomerRegistrationValidator');
const CustomerUpdatePasswordValidation = require('../validation/customer/CustomerUpdatePasswordValidation');
const CustomerUpdateValidation = require('../validation/customer/CustomerUpdateValidation');

const controller = new CustomerController();

router.post('/register', checkSchema(CustomerRegistration), ValidationMiddleware(), controller.register);

router.post('/login', checkSchema(CustomerLoginValidation), ValidationMiddleware(UnauthorizedException), controller.login);

router.put('/:id/update/password', AuthMiddleware, PermissionMiddleware.permit(), checkSchema(CustomerUpdatePasswordValidation), ValidationMiddleware(), controller.updatePassword);

router.put('/:id/update', AuthMiddleware, PermissionMiddleware.permit(), checkSchema(CustomerUpdateValidation), ValidationMiddleware(), controller.update);


module.exports = router;
