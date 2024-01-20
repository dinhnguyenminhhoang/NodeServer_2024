"use strict";

const { NotFoundError } = require("../../core/error.response");
const {
    product,
    electronic,
    clothing,
    furniture,
} = require("../../models/product.model");
const { Types } = require("mongoose");

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return queryProduct({ query, limit, skip });
};
const findAllUnPublishForShop = async ({ query, limit, skip }) => {
    return queryProduct({ query, limit, skip });
};
//
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) throw new NotFoundError("product not found");
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });
    if (!foundShop) throw new NotFoundError("product not found");
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
};
const queryProduct = async ({ query, limit, skip }) =>
    await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
module.exports = {
    publishProductByShop,
    unPublishProductByShop,
    findAllDraftForShop,
    findAllPublishForShop,
    findAllUnPublishForShop,
};
