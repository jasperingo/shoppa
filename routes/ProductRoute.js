
const express = require('express');
const { checkSchema } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ProductFetchMiddleware = require('../middlewares/fetch/ProductFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const ProductAddPermissionMiddleware = require('../middlewares/permissions/product/ProductAddPermissionMiddleware');
const ProductUpdatePermissionMiddleware = require('../middlewares/permissions/product/ProductUpdatePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const ProductAddValidation = require('../validation/product/ProductAddValidation');
const ProductUpdateValidation = require('../validation/product/ProductUpdateValidation');

const router = express.Router();

const controller = new ProductController();

router.post(
  '/add', 
  AuthMiddleware,
  ProductAddPermissionMiddleware,
  checkSchema(ProductAddValidation),
  ValidationMiddleware(),
  controller.add
);

router.put(
  '/:id(\\d+)/update', 
  ProductFetchMiddleware,
  AuthMiddleware,
  ProductUpdatePermissionMiddleware,
  checkSchema(ProductUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update',
  ProductFetchMiddleware, 
  AuthMiddleware,
  ProductUpdatePermissionMiddleware, 
  FileUploadMiddleware(Files.PRODUCT_PHOTO_PATH).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.get(
  '/:id(\\d+)',
  ProductFetchMiddleware, 
  controller.get
);

module.exports = router;

