"use strict";
const express = require("express");
const { asynchandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/amount", asynchandler(discountController.getAllDiscountAmount));
router.get(
    "/list-product-code",
    asynchandler(discountController.getAlldiscountWithProduct)
);
router.use(authenticationV2);
router.post("", asynchandler(discountController.createDiscountCode));
router.get("", asynchandler(discountController.getAllDiscountCode));
module.exports = router;
