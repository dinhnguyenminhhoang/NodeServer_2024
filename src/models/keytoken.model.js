// lưu lại id user,publicley và res token của user
"use strict";
//
const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshTokenUsed: {
            type: Array,
            default: [],
            // nhiệm vụ để tick hacker sử dụng trái phép các token này
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
