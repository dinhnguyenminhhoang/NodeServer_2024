// lưu lại id user,publicley và res token của user
"use strict";
//
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "completed", "failed", "pending"],
        },
        cart_products: {
            type: Array,
            required: true,
            default: [],
        },
        cart_count_product: { type: Number, required: true },
        cart_userId: { type: Number, required: true },
    },
    {
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
        },
        collection: COLLECTION_NAME,
    }
);

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema),
};
