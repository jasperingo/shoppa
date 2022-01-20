
const express = require('express');
const { checkSchema } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const ReviewController = require('../controllers/ReviewController');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ProductFetchMiddleware = require('../middlewares/fetch/ProductFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const ProductAddPermissionMiddleware = require('../middlewares/permissions/product/ProductAddPermissionMiddleware');
const ProductFetchPermissionMiddleware = require('../middlewares/permissions/product/ProductFetchPermissionMiddleware');
const ProductUpdatePermissionMiddleware = require('../middlewares/permissions/product/ProductUpdatePermissionMiddleware');
const SearchParamsMiddleware = require('../middlewares/SearchParamsMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const ProductAddValidation = require('../validation/product/ProductAddValidation');
const ProductUpdateValidation = require('../validation/product/ProductUpdateValidation');
const SearchValidation = require('../validation/search/SearchValidation');

const router = express.Router();

const controller = new ProductController();

const reviewController = new ReviewController();

router.post(
  '/create', 
  AuthMiddleware,
  ProductAddPermissionMiddleware,
  checkSchema(ProductAddValidation),
  ValidationMiddleware(),
  controller.create
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

router.delete(
  '/:id(\\d+)/delete',
  ProductFetchMiddleware, 
  AuthMiddleware,
  ProductUpdatePermissionMiddleware,
  controller.delete
);

router.get(
  '/search',
  SearchValidation,
  ValidationMiddleware(),
  SearchParamsMiddleware,
  PaginationMiddleware,
  controller.getListBySearch
);

router.get(
  '/:id(\\d+)/review/list', 
  ProductFetchMiddleware, 
  OptionalAuthMiddleware,
  ProductFetchPermissionMiddleware,
  PaginationMiddleware,
  reviewController.getListByProduct
);

router.get(
  '/:id(\\d+)',
  ProductFetchMiddleware, 
  OptionalAuthMiddleware,
  ProductFetchPermissionMiddleware,
  controller.get
);

module.exports = router;

