"use strict";
const express = require("express");
const { asynchandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
// create product
router.use(authenticationV2);
router.post("", asynchandler(productController.createProduct));

module.exports = router;
