"use strict";
const express = require("express");
const { asynchandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
// create product
router.use(authenticationV2);
router.post("", asynchandler(productController.createProduct));
router.post(
    "/publish/:id",
    asynchandler(productController.publishProductByShop)
);
router.post(
    "/un-publish/:id",
    asynchandler(productController.unPublishProductByShop)
);
//query

router.get("/draft/all", asynchandler(productController.getAllDraftFoShop));

router.get(
    "/publish/all",
    asynchandler(productController.getAllPublishForShop)
);
router.get(
    "/un-publish/all",
    asynchandler(productController.getAllUnPublishForShop)
);
module.exports = router;
