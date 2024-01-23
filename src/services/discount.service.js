const { badRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
    findAllDiscountCodeUnSelect,
    checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { covertObjectIdMoongoDb } = require("../utils");

const armDiscount = {};
class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;
        const newDate = new Date();
        if (newDate < Date(start_date) || newDate > new Date(end_date)) {
            throw new badRequestError("discount code has expired");
        }
        if (new Date(start_date) > new Date(end_date))
            throw new badRequestError(
                "start date must be before end date code has expired"
            );
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: covertObjectIdMoongoDb(shopId),
            })
            .lean();
        if (foundDiscount && foundDiscount.discount_is_active)
            throw new badRequestError("discunt exists");
        const newDiscount = await discount.create({
            discount_name: name,
            disocunt_description: description,
            disocunt_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: product_ids,
            discount_max_value: max_value,
        });
        return newDiscount;
    }
    static async updateDiscount({ discountId, payload }) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;
        return await discount.findByIdAndUpdate(
            discountId,
            {
                discount_name: name,
                disocunt_description: description,
                disocunt_type: type,
                discount_value: value,
                discount_code: code,
                discount_start_date: start_date,
                discount_end_date: end_date,
                discount_max_uses: max_uses,
                discount_uses_count: uses_count,
                discount_users_used: users_used,
                discount_max_uses_per_user: max_uses_per_user,
                discount_min_order_value: min_order_value,
                discount_shopId: shopId,
                discount_is_active: is_active,
                discount_applies_to: applies_to,
                discount_product_ids: product_ids,
                discount_max_value: max_value,
            },
            {
                new: isNew,
            }
        );
    }
    static async getAllDiscountCodeWithProduct({
        code,
        shopId,
        userId,
        page,
        limit,
    }) {
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: covertObjectIdMoongoDb(shopId),
            })
            .lean();
        if (!foundDiscount || !foundDiscount.discount_is_active)
            throw new NotFoundError("discount not found");
        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products = [];
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: covertObjectIdMoongoDb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    product_shop: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        return products;
    }
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeUnSelect({
            filter: {
                discount_shopId: covertObjectIdMoongoDb(shopId),
                discount_is_active: true,
            },
            model: discount,
            sort: "ctime",
            unSelect: ["__v", "discount_shopId"],
            limit: +limit,
            page: +page,
        });
        return discounts;
    }
    static async getDiscountAmount({ codeId, userId, shopId, products = [] }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: { discount_code: codeId },
            discount_shopId: shopId,
        });
        if (!foundDiscount) throw new NotFoundError("discount not found");
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            disocunt_type,
            discount_value,
        } = foundDiscount;
        if (!discount_is_active) throw new badRequestError("discount expired");
        if (discount_max_uses === 0)
            throw new NotFoundError("discount are out");
        if (
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new NotFoundError("discount are out");
        }
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            });
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(
                    "discount requires a minium order value"
                );
            }
        }
        if (discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(
                (user) => user.userId === userId
            );
            if (userDiscount) {
                throw new NotFoundError("discount is used only");
            }
        }
        const amount =
            disocunt_type === "fixed_amount"
                ? discount_value
                : (totalOrder * discount_value) / 100;
        return {
            totalOrder: totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }
    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findByIdAndDelete({
            discount_code: codeId,
            discount_shopId: covertObjectIdMoongoDb(shopId),
        });
        return deleted;
    }
}
module.exports = {
    DiscountService,
};
