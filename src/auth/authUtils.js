"use strict";
const JWT = require("jsonwebtoken");
const { asynchandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });
        //
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verifying::`, err);
            } else {
                console.log(`decode verification::`, decode);
            }
        });
        //
        return { accessToken, refreshToken };
    } catch (error) {}
};
//
const authentication = asynchandler(async (req, res, next) => {
    //step 1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request");
    //step 2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("NOT found keyStore");
    //step 3

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid request");
    //step 4
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId != decodeUser.userId)
            throw new AuthFailureError("Invalid user");
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});
module.exports = {
    createTokenPair,
    authentication,
};
