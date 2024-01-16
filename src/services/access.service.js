"use strict";

const shopModel = require("../models/shop.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
    badRequestError,
    AuthFailureError,
    ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RolesShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITTER: "EDITTER",
    ADMIN: "ADMIN",
};
class AccessService {
    static singUp = async ({ name, email, password }) => {
        //step 1 : check email exists
        const hodelShop = await shopModel.findOne({ email }).lean();
        if (hodelShop) {
            throw new badRequestError("error shop already rigisted");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newSHop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RolesShop.SHOP],
        });
        if (newSHop) {
            //create privateKey->find token,publicKey->verify token
            // áp dụng cho những hệ thống lớn
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: { type: "pkcs1", format: "pem" },
            //         privateKeyEncoding: { type: "pkcs1", format: "pem" },
            //     }
            // );
            //rsa : thuật toán bất đôi dứng
            // áp dụng cho các hệ thông  nhỏ
            const publicKey = crypto.randomBytes(64).toString(`hex`);
            const privateKey = crypto.randomBytes(64).toString(`hex`);
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newSHop._id,
                publicKey: publicKey,
                privateKey: privateKey,
            });
            if (!keyStore) {
                throw new badRequestError("keyStore error");
            }

            // const publicKeyObject = crypto.createPublicKey(publicKeyString);
            // console.log(`publicKeyObject::`, publicKeyObject);

            //create token pair
            const tokens = await createTokenPair(
                {
                    userId: newSHop._id,
                    email,
                },
                publicKey,
                privateKey
            );
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fill: ["_id", "name", "email"],
                        object: newSHop,
                    }),
                    tokens,
                },
            };
        }
        return {
            code: 200,
            metadata: null,
        };
    };
    //login
    static login = async ({ email, password, refreshToken = null }) => {
        //step 1
        const foundShop = await findByEmail({
            email,
        });

        if (!foundShop) {
            throw new badRequestError("shop not registered");
        }
        const { _id: userId } = foundShop;
        //step 2
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authentication Error");
        //step 3
        const publicKey = crypto.randomBytes(64).toString(`hex`);
        const privateKey = crypto.randomBytes(64).toString(`hex`);
        //step 4
        const tokens = await createTokenPair(
            {
                userId: userId,
                email: email,
            },
            publicKey,
            privateKey
        );
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: userId,
        });
        return {
            shop: getInfoData({
                fill: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };
    //end login
    // logout
    static Logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    };
    //end logout
    //handle RefreshToken
    static handleRefreshToken = async (refreshToken) => {
        //step 1 : check token userd
        const foundToken = await KeyTokenService.finfByRefreshTokenUsed(
            refreshToken
        );

        if (foundToken) {
            // check xem user này là ai
            const { userId, email } = await verifyJWT(
                refreshToken,
                foundToken.privateKey
            );
            // xoa
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError("somthing wrong heppend ");
        }
        // no-> check refresh token is use ?
        const holderToken = await KeyTokenService.findByRefreshToken(
            refreshToken
        );
        if (!holderToken) {
            throw new AuthFailureError("shop not registered");
        }
        // verify token

        const { userId, email } = await verifyJWT(
            refreshToken,
            holderToken.privateKey
        );
        //  check user identity
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("shop not registered");
        // create new token
        const tokens = await createTokenPair(
            {
                userId: userId,
                email: email,
            },
            holderToken.publicKey,
            holderToken.privateKey
        );
        //update token
        const updatedHolderToken = await KeyTokenService.findAndUpdate(
            tokens,
            refreshToken
        );
        return {
            user: { userId, email },
            tokens,
        };
    };
    // end handler refresh token
}
module.exports = AccessService;
