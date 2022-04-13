
const express = require('express');
const { checkSchema } = require('express-validator');
const SubCategoryController = require('../controllers/SubCategoryController');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const SubCategoryFetchMiddleware = require('../middlewares/fetch/SubCategoryFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const CategoryPermissionMiddleware = require('../middlewares/permissions/CategoryPermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const SubCategoryAddValidation = require('../validation/sub_category/SubCategoryAddValidation');
const SubCategoryUpdateValidation = require('../validation/sub_category/SubCategoryUpdateValidation');

const router = express.Router();

const controller = new SubCategoryController();

router.post(
  '/create', 
  AuthMiddleware,
  CategoryPermissionMiddleware,
  checkSchema(SubCategoryAddValidation),
  ValidationMiddleware,
  controller.add
);

router.put(
  '/:id(\\d+)/update', 
  SubCategoryFetchMiddleware,
  AuthMiddleware,
  CategoryPermissionMiddleware,
  checkSchema(SubCategoryUpdateValidation),
  ValidationMiddleware,
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update', 
  SubCategoryFetchMiddleware,
  AuthMiddleware,
  CategoryPermissionMiddleware,
  FileUploadMiddleware(Files.SUB_CATEGORY_PHOTO_PATH).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.get(
  '/:id(\\d+)', 
  SubCategoryFetchMiddleware,
  controller.get
);

module.exports = router;
