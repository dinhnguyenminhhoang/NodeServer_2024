"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductSerrvice = require("../services/product.service");
class ProductController {
    createProduct = async (req, res, next) => {
        console.log("call create product api");
        new SuccessResponse({
            message: "Create Product successfully",
            metadata: await ProductSerrvice.createProduct(
                req.body.product_type,
                req.body
            ),
        }).send(res);
    };
}
module.exports = new ProductController();
