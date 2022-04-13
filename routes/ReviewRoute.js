
const express = require('express');
const { checkSchema } = require('express-validator');
const ReviewController = require('../controllers/ReviewController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const ProductReviewCreatePermissionMiddleware = require('../middlewares/permissions/review/ProductReviewCreatePermissionMiddleware');
const ProductReviewCreateValidation = require('../validation/review/ProductReviewCreateValidation');
const StoreReviewCreatePermissionMiddleware = require('../middlewares/permissions/review/StoreReviewCreatePermissionMiddleware');
const StoreReviewCreateValidation = require('../validation/review/StoreReviewCreateValidation');
const DeliveryFirmReviewCreatePermissionMiddleware = require('../middlewares/permissions/review/DeliveryFirmReviewCreatePermissionMiddleware');
const DeliveryFirmReviewCreateValidation = require('../validation/review/DeliveryFirmReviewCreateValidation');
const ReviewFetchMiddleware = require('../middlewares/fetch/ReviewFetchMiddleware');
const ReviewUpdatePermissionMiddleware = require('../middlewares/permissions/review/ReviewUpdatePermissionMiddleware');
const ReviewUpdateValidation = require('../validation/review/ReviewUpdateValidation');

const router = express.Router();

const controller = new ReviewController();

router.post(
  '/product/create',
  AuthMiddleware,
  ProductReviewCreatePermissionMiddleware,
  checkSchema(ProductReviewCreateValidation),
  ValidationMiddleware,
  controller.createForProduct
);

router.post(
  '/store/create',
  AuthMiddleware,
  StoreReviewCreatePermissionMiddleware,
  checkSchema(StoreReviewCreateValidation),
  ValidationMiddleware,
  controller.createForStore
);

router.post(
  '/delivery-firm/create',
  AuthMiddleware,
  DeliveryFirmReviewCreatePermissionMiddleware,
  checkSchema(DeliveryFirmReviewCreateValidation),
  ValidationMiddleware,
  controller.createForDeliveryFirm
);

router.put(
  '/:id(\\d+)/update',
  ReviewFetchMiddleware,
  AuthMiddleware,
  ReviewUpdatePermissionMiddleware,
  checkSchema(ReviewUpdateValidation),
  ValidationMiddleware,
  controller.update
);

router.delete(
  '/:id(\\d+)/delete',
  ReviewFetchMiddleware,
  AuthMiddleware,
  ReviewUpdatePermissionMiddleware,
  controller.delete
);

module.exports = router;
