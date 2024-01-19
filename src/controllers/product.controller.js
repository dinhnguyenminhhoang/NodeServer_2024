"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductSerrvice = require("../services/product.service");
const ProductSerrviceV2 = require("../services/productMatchingFactoryAndStrategy.service");
class ProductController {
    createProduct = async (req, res, next) => {
        console.log("call create product api");
        new SuccessResponse({
            message: "Create Product successfully",
            metadata: await ProductSerrviceV2.createProduct(
                req.body.product_type,
                { ...req.body, product_shop: req.user.userId }
            ),
        }).send(res);
    };
}
module.exports = new ProductController();
