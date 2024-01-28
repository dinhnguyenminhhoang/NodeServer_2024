"use strict";
const express = require("express");
const { asynchandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
// router.use(authenticationV2);

// authentication
router.post("", asynchandler(cartController.addToCart));
router.delete("", asynchandler(cartController.deleteCart));
router.post("/update", asynchandler(cartController.updateCart));
router.get("", asynchandler(cartController.listToCart));

module.exports = router;
