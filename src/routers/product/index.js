"use strict";
const express = require("express");
const { asynchandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();
// create product
router.use(authentication);
router.post("", asynchandler(productController.createProduct));

module.exports = router;
