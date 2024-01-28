"use strict";

const { NotFoundError } = require("../../core/error.response");
const {
    product,
    electronic,
    clothing,
    furniture,
} = require("../../models/product.model");
const { Types } = require("mongoose");
const {
    getSelectData,
    unGetSelectData,
    covertObjectIdMoongoDb,
} = require("../../utils");

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return queryProduct({ query, limit, skip });
};
const findAllUnPublishForShop = async ({ query, limit, skip }) => {
    return queryProduct({ query, limit, skip });
};
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
        .find(
            {
                $text: { $search: regexSearch },
            },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();
    return results;
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
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    return products;
};
const findProduct = async ({ product_id, unSelect }) => {
    return await product
        .findById(product_id)
        .select(unGetSelectData(unSelect))
        .lean();
};
const updateProductById = async ({
    product_id,
    bodyUpdate,
    model,
    isNew = true,
}) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, {
        new: isNew,
    });
};
const getProductById = async (productId) => {
    return await product
        .findOne({ _id: covertObjectIdMoongoDb(productId) })
        .lean();
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
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
};
