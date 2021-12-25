
const express = require('express');
const CustomerRoute = require('./CustomerRoute');
const AddressRoute = require('./AddressRoute');
const AdministratorRoute = require('./AdministratorRoute');
const CategoryRoute = require('./CategoryRoute');
const SubCategoryRoute = require('./SubCategoryRoute');
const StoreRoute = require('./StoreRoute');

const router = express.Router();

router.use('/customer', CustomerRoute);

router.use('/address', AddressRoute);

router.use('/administrator', AdministratorRoute);

router.use('/category', CategoryRoute);

router.use('/sub-category', SubCategoryRoute);

router.use('/store', StoreRoute);

module.exports = router;

