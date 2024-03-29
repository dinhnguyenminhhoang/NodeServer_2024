"use strict";

const { badRequestError } = require("../core/error.response");
const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    findAllUnPublishForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

//define factory to create product
class productMatchingFactoryAndStrategy {
    /*
    Type: "clothing" or "electronic"
    payload:data
    */

    static productRegistry = {}; // key and class
    static registerProductType(type, classRef) {
        productMatchingFactoryAndStrategy.productRegistry[type] = classRef;
    }
    static async createProduct(type, payload) {
        const productClass =
            productMatchingFactoryAndStrategy.productRegistry[type];
        if (!productClass) throw new badRequestError("Invalid type:::", type);
        return new productClass(payload).createProduct();
    }
    static async updateProduct(type, productId, payload) {
        const productClass =
            productMatchingFactoryAndStrategy.productRegistry[type];
        if (!productClass) throw new badRequestError("Invalid type:::", type);
        return new productClass(payload).updateProduct(productId);
    }
    //Put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_id, product_shop });
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_id, product_shop });
    }
    // end put
    // query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip });
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }
    static async findAllUnPublishForShop({
        product_shop,
        limit = 50,
        skip = 0,
    }) {
        const query = { product_shop, isPublished: false };
        return await findAllUnPublishForShop({ query, limit, skip });
    }

    static async getListSearchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }
    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: [
                "product_name",
                "product_price",
                "product_thumb",
                "product_shop",
            ],
        });
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] });
    }

    // end query
}

// define base product
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_shop,
        product_attributes,
        product_type,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_type = product_type;
    }
    // create new product
    async createProduct(productId) {
        const newProduct = await product.create({ ...this, _id: productId });
        if (newProduct) {
            // add product stock
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            });
        }
        return newProduct;
    }
    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({
            product_id: productId,
            bodyUpdate,
            model: product,
        });
    }
}
//define sub-class for different product type = clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new badRequestError("create new clothing err");
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new badRequestError("create new product err");
        return newProduct;
    }
    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            await updateProductById({
                product_id: productId,
                bodyUpdate: updateNestedObjectParser(
                    objectParams.product_attributes
                ),
                model: clothing,
            });
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        );
        return updateProduct;
    }
}
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic)
            throw new badRequestError("create new Electronic err");
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new badRequestError("create new product err");
        return newProduct;
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture)
            throw new badRequestError("create new furniture err");
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new badRequestError("create new product err");
        return newProduct;
    }
}
// regis productType
productMatchingFactoryAndStrategy.registerProductType(
    "Electronics",
    Electronic
);
productMatchingFactoryAndStrategy.registerProductType("Furniture", Furniture);
productMatchingFactoryAndStrategy.registerProductType("Clothing", Clothing);
module.exports = productMatchingFactoryAndStrategy;
