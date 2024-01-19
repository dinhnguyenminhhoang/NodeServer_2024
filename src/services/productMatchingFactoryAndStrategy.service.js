"use strict";

const { badRequestError } = require("../core/error.response");
const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model");

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
        return await product.create({ ...this, _id: productId });
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
