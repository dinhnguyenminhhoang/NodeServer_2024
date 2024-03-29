"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asynchandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//

// signUp
router.post("/shop/signup", asynchandler(accessController.singUp));

//signIn
router.post("/shop/login", asynchandler(accessController.login));

// authentication
router.use(authenticationV2);
router.post("/shop/logout", asynchandler(accessController.logout));

router.post(
    "/shop/refreshToken",
    asynchandler(accessController.handleRefreshToken)
);

module.exports = router;
