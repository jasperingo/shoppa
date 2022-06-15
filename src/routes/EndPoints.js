const express = require('express');
const CustomerRoute = require('./CustomerRoute');
const AddressRoute = require('./AddressRoute');
const CategoryRoute = require('./CategoryRoute');
const SubCategoryRoute = require('./SubCategoryRoute');
const StoreRoute = require('./StoreRoute');
const ProductRoute = require('./ProductRoute');
const ProductVariantRoute = require('./ProductVariantRoute');
const LocationRoute = require('./LocationRoute');
const FavoriteRoute = require('./FavoriteRoute');
const OrderRoute = require('./OrderRoute');
const OrderItemRoute = require('./OrderItemRoute');
const TransactionRoute = require('./TransactionRoute');
const PasswordResetRoute = require('./PasswordResetRoute');
const ReviewRoute = require('./ReviewRoute');

const router = express.Router();

router.use('/customer', CustomerRoute);

router.use('/address', AddressRoute);

router.use('/category', CategoryRoute);

router.use('/sub-category', SubCategoryRoute);

router.use('/store', StoreRoute);

router.use('/product', ProductRoute);

router.use('/product-variant', ProductVariantRoute);

router.use('/location', LocationRoute);

router.use('/favorite', FavoriteRoute);

router.use('/order', OrderRoute);

router.use('/order-item', OrderItemRoute);

router.use('/transaction', TransactionRoute);

router.use('/password-reset', PasswordResetRoute);

router.use('/review', ReviewRoute);

module.exports = router;
