
const express = require('express');
const { checkSchema } = require('express-validator');
const CategoryController = require('../controllers/CategoryController');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const CategoryFetchMiddleware = require('../middlewares/fetch/CategoryFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const CategoryPermissionMiddleware = require('../middlewares/permissions/CategoryPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const CategoryAddValidation = require('../validation/category/CategoryAddValidation');
const CategoryUpdateValidation = require('../validation/category/CategoryUpdateValidation');

const router = express.Router();

const controller = new CategoryController();

router.post(
  '/add', 
  AuthMiddleware,
  CategoryPermissionMiddleware,
  checkSchema(CategoryAddValidation),
  ValidationMiddleware(),
  controller.add
);

router.put(
  '/:id(\\d+)/update', 
  CategoryFetchMiddleware,
  AuthMiddleware,
  CategoryPermissionMiddleware,
  checkSchema(CategoryUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update', 
  CategoryFetchMiddleware,
  AuthMiddleware,
  CategoryPermissionMiddleware,
  FileUploadMiddleware(Files.CATEGORY_PHOTO_PATH).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.get(
  '/store/list',
  controller.getListByStore
);

router.get(
  '/product/list',
  controller.getListByProduct
);

router.get(
  '/:id(\\d+)', 
  CategoryFetchMiddleware,
  controller.get
);

module.exports = router;

