"use strict";

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
    {
        product_name: { type: String, require: true },
        product_thumb: { type: String, require: true },
        product_description: { type: String },
        product_price: { type: Number, require: true },
        product_quantity: { type: Number, require: true },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" }, // match schema.type.ojId
        product_attributes: { type: Schema.Types.Mixed, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Clothing", "Electronics", "Furniture"],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);
//
const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    },
    {
        timestamps: true,
        collection: "Clothes",
    }
);
const electronicSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    },
    {
        timestamps: true,
        collection: "Electronics",
    }
);
const furnitureSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: String,
        color: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    },
    {
        timestamps: true,
        collection: "Furnitures",
    }
);
//
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronic: model("Electronic", electronicSchema),
    furniture: model("Furniture", furnitureSchema),
};
