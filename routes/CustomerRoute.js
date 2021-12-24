
const express = require('express');
const { checkSchema } = require('express-validator');
const CustomerController = require('../controllers/CustomerController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const PermissionMiddleware = require('../middlewares/PermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const CustomerLoginValidation = require('../validation/customer/CustomerLoginValidation');
const CustomerRegistrationValidation = require('../validation/customer/CustomerRegistrationValidation');
const CustomerUpdatePasswordValidation = require('../validation/customer/CustomerUpdatePasswordValidation');
const CustomerUpdateValidation = require('../validation/customer/CustomerUpdateValidation');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');

const router = express.Router();

const controller = new CustomerController();

router.post('/register', checkSchema(CustomerRegistrationValidation), ValidationMiddleware(), controller.register);

router.post('/login', checkSchema(CustomerLoginValidation), ValidationMiddleware(UnauthorizedException), controller.login);

router.put('/:id/update/photo', AuthMiddleware, PermissionMiddleware.permit(), FileUploadMiddleware('user').single('photo'), FileUploadValidationMiddleware, controller.updatePhoto);

router.put('/:id/update/password', AuthMiddleware, PermissionMiddleware.permit(), checkSchema(CustomerUpdatePasswordValidation), ValidationMiddleware(), controller.updatePassword);

router.put('/:id/update', AuthMiddleware, PermissionMiddleware.permit(), checkSchema(CustomerUpdateValidation), ValidationMiddleware(), controller.update);


module.exports = router;
