
const express = require('express');
const customerRouter = require('./CustomerRoute');
const addressRouter = require('./AddressRoute');

const router = express.Router();

router.use('/customer', customerRouter);

router.use('/address', addressRouter)

module.exports = router;

