"use strict";
const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    //create token
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            //lv0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey,
            // });
            // return tokens ? tokens.publicKey : null;

            //lv xx
            const fill = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokenUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true };
            const tokens = await keytokenModel.findOneAndUpdate(
                fill,
                update,
                options
            );
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
    // remove token
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id);
    };
    //findOne user
    static findByUserId = async (userId) => {
        return await keytokenModel
            .findOne({ user: new Types.ObjectId(userId) })
            .lean();
    };
    // check tokend Userd
    static finfByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel
            .findOne({ refreshTokenUsed: refreshToken })
            .lean();
    };
    // detele Key
    static deleteKeyById = async (userId) => {
        return await keytokenModel
            .deleteOne({ user: new Types.ObjectId(userId) })
            .lean();
    };
    //find by refreshtoken
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel
            .findOne({ refreshToken: refreshToken })
            .lean();
    };
    // find and update
    static findAndUpdate = async (tokens, refreshToken) => {
        return await keytokenModel.findOneAndUpdate(
            { refreshToken: refreshToken },
            {
                $set: { refreshToken: tokens.refreshToken },
                $addToSet: { refreshTokenUsed: refreshToken },
            },
            { new: true } // Trả về bản ghi đã được cập nhật
        );
    };
}
module.exports = KeyTokenService;
