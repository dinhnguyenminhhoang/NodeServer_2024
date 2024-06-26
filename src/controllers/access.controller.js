"use strict";

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
    login = async (req, res, next) => {
        console.log("call login api");
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };
    singUp = async (req, res, next) => {
        console.log("call singUp api");
        new CREATED({
            message: "Register OK!",
            metadata: await AccessService.singUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "logout successfully",
            metadata: await AccessService.Logout({ keyStore: req.keyStore }),
        }).send(res);
    };
    handleRefreshToken = async (req, res, next) => {
        console.log("call refreshToken api");
        //vs1
        // new SuccessResponse({
        //     message: "get token successfully",
        //     metadata: await AccessService.handleRefreshToken(
        //         req.body.refreshToken
        //     ),
        // }).send(res);

        //vs2
        new SuccessResponse({
            message: "get token successfully",
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        }).send(res);
    };
}
module.exports = new AccessController();
