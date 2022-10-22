const path = require('path');
const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');
const prodController = require("../controllers/products");

const router = express.Router();

router.get("/", prodController.getProducts);

module.exports = router;
