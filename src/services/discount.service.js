const { badRequestError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
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
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: covertObjectIdMoongoDb(shopId),
        });
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
}
