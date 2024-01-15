"use strict";

const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res);
    };
    singUp = async (req, res, next) => {
        new CREATED({
            message: "Register OK!",
            metadata: await AccessService.singUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };
    logout = async (req, res, next) => {
        console.log(req.keyStore);
        new SuccessResponse({
            message: "logout successfully",
            metadata: await AccessService.Logout(req.keyStore),
        }).send(res);
    };
    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "get token successfully",
            metadata: await AccessService.handleRefreshToken(
                req.body.refreshToken
            ),
        }).send(res);
    };
}
module.exports = new AccessController();
