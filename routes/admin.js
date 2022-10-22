const express = require('express');

const prodController = require("../controllers/products");

const router = express.Router();


router.get("/add-product", prodController.getAddProduct );

router.post('/add-product', prodController.postAddProduct);

module.exports = router