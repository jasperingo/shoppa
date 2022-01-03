
const express = require('express');
const CustomerRoute = require('./CustomerRoute');
const AddressRoute = require('./AddressRoute');
const AdministratorRoute = require('./AdministratorRoute');
const CategoryRoute = require('./CategoryRoute');
const SubCategoryRoute = require('./SubCategoryRoute');
const StoreRoute = require('./StoreRoute');
const ProductRoute = require('./ProductRoute');
const DeliveryFirmRoute = require('./DeliveryFirmRoute');
const LocationRoute = require('./LocationRoute');
const RouteRoute = require('./RouteRoute');
const FavoriteRoute = require('./FavoriteRoute');
const SavedCartRoute = require('./SavedCartRoute');

const router = express.Router();

router.use('/customer', CustomerRoute);

router.use('/address', AddressRoute);

router.use('/administrator', AdministratorRoute);

router.use('/category', CategoryRoute);

router.use('/sub-category', SubCategoryRoute);

router.use('/store', StoreRoute);

router.use('/product', ProductRoute);

router.use('/delivery-firm', DeliveryFirmRoute);

router.use('/location', LocationRoute);

router.use('/route', RouteRoute);

router.use('/favorite', FavoriteRoute);

router.use('/saved-cart', SavedCartRoute);

module.exports = router;

