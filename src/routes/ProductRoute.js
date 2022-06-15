
const express = require('express');
const { checkSchema } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const ReviewController = require('../controllers/ReviewController');
const Files = require('../utils/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ProductFetchMiddleware = require('../middlewares/fetch/ProductFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const ProductAddPermissionMiddleware = require('../middlewares/permissions/product/ProductAddPermissionMiddleware');
const ProductFetchPermissionMiddleware = require('../middlewares/permissions/product/ProductFetchPermissionMiddleware');
const ProductUpdatePermissionMiddleware = require('../middlewares/permissions/product/ProductUpdatePermissionMiddleware');
const SearchParamsMiddleware = require('../middlewares/SearchParamsMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const ProductAddValidation = require('../validation/product/ProductAddValidation');
const ProductRecommendedUpdateValidation = require('../validation/product/ProductRecommendedUpdateValidation');
const ProductUpdateValidation = require('../validation/product/ProductUpdateValidation');
const SearchValidation = require('../validation/search/SearchValidation');
const ProductListFilterMiddleware = require('../middlewares/ProductListFilterMiddleware');

const router = express.Router();

const controller = new ProductController();

const reviewController = new ReviewController();

router.post(
  '/create', 
  AuthMiddleware,
  ProductAddPermissionMiddleware,
  checkSchema(ProductAddValidation),
  ValidationMiddleware,
  controller.create
);

router.put(
  '/:id(\\d+)/update', 
  ProductFetchMiddleware,
  AuthMiddleware,
  ProductUpdatePermissionMiddleware,
  checkSchema(ProductUpdateValidation),
  ValidationMiddleware,
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

router.put(
  '/:id(\\d+)/recommended/update',
  ProductFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware, 
  checkSchema(ProductRecommendedUpdateValidation),
  ValidationMiddleware,
  controller.updateRecommended
);

router.delete(
  '/:id(\\d+)/delete',
  ProductFetchMiddleware, 
  AuthMiddleware,
  ProductUpdatePermissionMiddleware,
  controller.delete
);

router.get(
  '/random/list',
  PaginationMiddleware,
  ProductListFilterMiddleware,
  controller.getRandomList
);

router.get(
  '/recommended/list',
  PaginationMiddleware,
  ProductListFilterMiddleware,
  controller.getListByRecommeded
);

router.get(
  '/search',
  SearchValidation,
  ValidationMiddleware,
  SearchParamsMiddleware,
  PaginationMiddleware,
  ProductListFilterMiddleware,
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
  '/:id(\\d+)/related/list',
  ProductFetchMiddleware, 
  OptionalAuthMiddleware,
  ProductFetchPermissionMiddleware,
  PaginationMiddleware,
  ProductListFilterMiddleware,
  controller.getRelatedList
);

router.get(
  '/:id(\\d+)',
  ProductFetchMiddleware, 
  OptionalAuthMiddleware,
  ProductFetchPermissionMiddleware,
  controller.get
);

module.exports = router;
