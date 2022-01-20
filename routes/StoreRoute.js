
const express = require('express');
const { checkSchema } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const StoreController = require('../controllers/StoreController');
const ProductController = require('../controllers/ProductController');
const WithdrawalAccountController = require('../controllers/WithdrawalAccountController');
const WorkingHourController = require('../controllers/WorkingHourController');
const UnauthorizedException = require('../http/exceptions/UnauthorizedException');
const Files = require('../http/Files');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const StoreFetchMiddleware = require('../middlewares/fetch/StoreFetchMiddleware');
const FileUploadMiddleware = require('../middlewares/FileUploadMiddleware');
const FileUploadValidationMiddleware = require('../middlewares/FileUploadValidationMiddleware');
const PaginationMiddleware = require('../middlewares/PaginationMiddleware');
const AdministratorPermissionMiddleware = require('../middlewares/permissions/AdministratorPermissionMiddleware');
const StorePermissionMiddleware = require('../middlewares/permissions/store/StorePermissionMiddleware');
const ValidationMiddleware = require('../middlewares/ValidationMiddleware');
const AddressUpdateValidation = require('../validation/address/AddressUpdateValidation');
const StoreLoginValidation = require('../validation/store/StoreLoginValidation');
const StoreRegisterValidation = require('../validation/store/StoreRegisterValidation');
const StoreUpdateValidation = require('../validation/store/StoreUpdateValidation');
const WithdrawalAccountUpdateValidation = require('../validation/withdrawal_account/WithdrawalAccountUpdateValidation');
const WorkingHourUpdateValidation = require('../validation/working_hour/WorkingHourUpdateValidation');
const SavedCartController = require('../controllers/SavedCartController');
const DiscountController = require('../controllers/DiscountController');
const StoreLoginPermissionMiddleware = require('../middlewares/permissions/store/StoreLoginPermissionMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalAuthMiddleware');
const StoreFetchPermissionMiddleware = require('../middlewares/permissions/store/StoreFetchPermissionMiddleware');
const StoreAndAdminPermissionMiddleware = require('../middlewares/permissions/store/StoreAndAdminPermissionMiddleware');
const CustomerUpdateStatusValidation = require('../validation/customer/CustomerUpdateStatusValidation');
const OrderController = require('../controllers/OrderController');
const TransactionController = require('../controllers/TransactionController');
const ReviewController = require('../controllers/ReviewController');
const OrderListFilterMiddleware = require('../middlewares/OrderListFilterMiddleware');
const SearchParamsMiddleware = require('../middlewares/SearchParamsMiddleware');
const SearchValidation = require('../validation/search/SearchValidation');

const router = express.Router();

const controller = new StoreController();

const productController = new ProductController();

const addressController = new AddressController();

const workingHourController = new WorkingHourController();

const withdrawalAccountController = new WithdrawalAccountController();

const savedCartController = new SavedCartController();

const discountController = new DiscountController();

const orderController = new OrderController();

const transactionController = new TransactionController();

const reviewController = new ReviewController();

router.post(
  '/register', 
  checkSchema(StoreRegisterValidation),
  ValidationMiddleware(),
  controller.register
);

router.post(
  '/login',
  checkSchema(StoreLoginValidation),
  ValidationMiddleware(UnauthorizedException),
  StoreLoginPermissionMiddleware,
  controller.login
);

router.get(
  '/list', 
  AuthMiddleware, 
  AdministratorPermissionMiddleware,
  PaginationMiddleware,
  controller.getList
);

router.get(
  '/search',
  SearchValidation,
  ValidationMiddleware(),
  SearchParamsMiddleware,
  PaginationMiddleware,
  controller.getListBySearch
);

router.put(
  '/:id(\\d+)/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(StoreUpdateValidation),
  ValidationMiddleware(),
  controller.update
);

router.put(
  '/:id(\\d+)/photo/update',
  StoreFetchMiddleware, 
  AuthMiddleware,
  StorePermissionMiddleware, 
  FileUploadMiddleware(Files.USER_PHOTO_PATHS.store).single('photo'), 
  FileUploadValidationMiddleware('photo'), 
  controller.updatePhoto
);

router.put(
  '/:id(\\d+)/status/update', 
  StoreFetchMiddleware, 
  AuthMiddleware,
  AdministratorPermissionMiddleware, 
  checkSchema(CustomerUpdateStatusValidation),
  ValidationMiddleware(), 
  controller.updateStatus
);

router.put(
  '/:id(\\d+)/address/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(AddressUpdateValidation),
  ValidationMiddleware(),
  addressController.updateStoreAddress
);

router.put(
  '/:id(\\d+)/working-hours/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(WorkingHourUpdateValidation),
  ValidationMiddleware(),
  workingHourController.updateStoreWorkingHours
);

router.put(
  '/:id(\\d+)/withdrawal-account/update',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  checkSchema(WithdrawalAccountUpdateValidation),
  ValidationMiddleware(),
  withdrawalAccountController.updateStoreWithdrawalAccount
);

router.get(
  '/:id(\\d+)/product/list',
  StoreFetchMiddleware,
  OptionalAuthMiddleware,
  StoreFetchPermissionMiddleware,
  PaginationMiddleware,
  productController.getListByStore
);

router.get(
  '/:id(\\d+)/product/discount/:discountId(\\d+)',
  StoreFetchMiddleware,
  AuthMiddleware,
  StorePermissionMiddleware,
  PaginationMiddleware,
  productController.getListByStoreWithDiscount
);

router.get(
  '/:id(\\d+)/saved-cart/list', 
  StoreFetchMiddleware,
  AuthMiddleware, 
  StoreAndAdminPermissionMiddleware,
  PaginationMiddleware,
  savedCartController.getListByStore
);

router.get(
  '/:id(\\d+)/discount/list', 
  StoreFetchMiddleware,
  OptionalAuthMiddleware,
  StoreFetchPermissionMiddleware,
  PaginationMiddleware,
  discountController.getListByStore
);


router.get(
  '/:id(\\d+)/order/list', 
  StoreFetchMiddleware,
  AuthMiddleware,
  StoreAndAdminPermissionMiddleware,
  PaginationMiddleware,
  OrderListFilterMiddleware,
  orderController.getListByStore
);

router.get(
  '/:id(\\d+)/transaction/list', 
  StoreFetchMiddleware,
  AuthMiddleware,
  StoreAndAdminPermissionMiddleware,
  PaginationMiddleware,
  transactionController.getListByStore
);

router.get(
  '/:id(\\d+)/transaction/balance', 
  StoreFetchMiddleware,
  AuthMiddleware,
  StoreAndAdminPermissionMiddleware,
  transactionController.getBalanceByStore
);

router.get(
  '/:id(\\d+)/review/list', 
  StoreFetchMiddleware,
  OptionalAuthMiddleware,
  StoreFetchPermissionMiddleware,
  PaginationMiddleware,
  reviewController.getListByStore
);

router.get(
  '/:id(\\d+)',
  StoreFetchMiddleware,
  OptionalAuthMiddleware,
  StoreFetchPermissionMiddleware,
  controller.get
);

module.exports = router;
