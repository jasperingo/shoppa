
const express = require('express');
const BankController = require('../controllers/BankController');

const router = express.Router();

const controller = new BankController();

router.get(
  '/list',
  controller.getList
);

module.exports = router;

