"use strict";

const { SuccessResponse } = require("../core/success.response");
const { DiscountService } = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "create discount successfully",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "get all discount by shop successfully",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
    getAllDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "get discount amountsuccessfully",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    };
    getAlldiscountWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get all discount with product successfully",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();
