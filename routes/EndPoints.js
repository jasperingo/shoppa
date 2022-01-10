
const express = require('express');
const CustomerRoute = require('./CustomerRoute');
const AddressRoute = require('./AddressRoute');
const AdministratorRoute = require('./AdministratorRoute');
const CategoryRoute = require('./CategoryRoute');
const SubCategoryRoute = require('./SubCategoryRoute');
const StoreRoute = require('./StoreRoute');
const ProductRoute = require('./ProductRoute');
const ProductVariantRoute = require('./ProductVariantRoute');
const DeliveryFirmRoute = require('./DeliveryFirmRoute');
const LocationRoute = require('./LocationRoute');
const RouteRoute = require('./RouteRoute');
const RouteWeightRoute = require('./RouteWeightRoute');
const RouteDurationRoute = require('./RouteDurationRoute');
const FavoriteRoute = require('./FavoriteRoute');
const SavedCartRoute = require('./SavedCartRoute');
const DiscountRoute = require('./DiscountRoute');
const DiscountProductRoute = require('./DiscountProductRoute');
const OrderRoute = require('./OrderRoute');
const OrderItemRoute = require('./OrderItemRoute');
const TransactionRoute = require('./TransactionRoute');

const router = express.Router();

router.use('/customer', CustomerRoute);

router.use('/address', AddressRoute);

router.use('/administrator', AdministratorRoute);

router.use('/category', CategoryRoute);

router.use('/sub-category', SubCategoryRoute);

router.use('/store', StoreRoute);

router.use('/product', ProductRoute);

router.use('/product-variant', ProductVariantRoute);

router.use('/delivery-firm', DeliveryFirmRoute);

router.use('/location', LocationRoute);

router.use('/route', RouteRoute);

router.use('/route-weight', RouteWeightRoute);

router.use('/route-duration', RouteDurationRoute);

router.use('/favorite', FavoriteRoute);

router.use('/saved-cart', SavedCartRoute);

router.use('/discount', DiscountRoute);

router.use('/discount-product', DiscountProductRoute);

router.use('/order', OrderRoute);

router.use('/order-item', OrderItemRoute);

router.use('/transaction', TransactionRoute);

module.exports = router;

