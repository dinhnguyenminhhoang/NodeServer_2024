const { cart } = require("../cart.model");

const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;

    const query = {
            cart_userId: userId,
            "cart_product.productId": productId,
            cart_state: "active",
        },
        update = {
            $in: { "cart_products.$.quantity": quantity },
        },
        option = {
            upsert: true,
            new: true,
        };
    return await cart.findByIdAndUpdate(query, update, option);
};

module.exports = {
    updateUserCartQuantity,
};
