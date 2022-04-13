
const express = require('express');
const { checkSchema } = require('express-validator');
const PromotionController = require('../controllers/PromotionController');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const PromotionFetchMiddleware = require('../middlewares/fetch/PromotionFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const PromotionCreateValidation = require('../validation/promotion/PromotionCreateValidation');

const PromotionRoute = express.Router();

const controller = new PromotionController();

PromotionRoute.post(
  '/create',
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  checkSchema(PromotionCreateValidation), 
  ValidationMiddleware,
  controller.create
);

PromotionRoute.put(
  '/:id(\\d+)/photo/update',
  PromotionFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware, 
  FileUploadMiddleware(Files.PROMOTION_PHOTO_PATH).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

PromotionRoute.delete(
  '/:id(\\d+)/delete',
  PromotionFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  controller.delete
);

PromotionRoute.get(
  '/random/list',
  PaginationMiddleware,
  controller.getRandomList
);

PromotionRoute.get(
  '/list',
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  controller.getList
);

PromotionRoute.get(
  '/:id(\\d+)',
  PromotionFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware,
  controller.get
);

module.exports = PromotionRoute;
