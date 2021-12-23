
const express = require('express');
const router = express.Router();
const customerRouter = require('./CustomerRoute');

router.use('/customer', customerRouter);

module.exports = router;

