
const express = require('express');
const LocationController = require('../controllers/LocationController');

const router = express.Router();

const controller = new LocationController();

router.get(
  '/list',
  controller.getList
);

module.exports = router;

