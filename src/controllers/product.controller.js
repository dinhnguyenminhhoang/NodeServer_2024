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
    //update
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "update Product successfully",
            metadata: await ProductSerrviceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "publish Product successfully",
            metadata: await ProductSerrviceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublish Product successfully",
            metadata: await ProductSerrviceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    findProduct = async (req, res, next) => {
        console.log("call api find product", req.params.product_id);
        new SuccessResponse({
            message: "find product successfully",
            metadata: await ProductSerrviceV2.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res);
    };
    // query

    /**
     * @description get all Draft for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftFoShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list draft successfully",
            metadata: await ProductSerrviceV2.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list publish successfully",
            metadata: await ProductSerrviceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    getAllUnPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list unPublish successfully",
            metadata: await ProductSerrviceV2.findAllUnPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get list search successfully",
            metadata: await ProductSerrviceV2.getListSearchProduct(req.params),
        }).send(res);
    };
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "find all product successfully",
            metadata: await ProductSerrviceV2.findAllProducts(req.query),
        }).send(res);
    };

    //end query
}
module.exports = new ProductController();
