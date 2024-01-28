const { cart } = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
    const query = {
        cart_userId: userId,
        cart_state: "active",
    };
    const update = {
            $addToSet: { cart_products: product },
        },
        option = {
            upsert: true,
            new: true,
        };
    return await cart.findByIdAndUpdate({
        query,
        update,
        option,
    });
};
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
    return await cart.findByIdAndUpdate({
        query,
        update,
        option,
    });
};
const deleteUserCart = async ({ userId, productId }) => {
    const query = {
            cart_userId: userId,
            cart_state: "active",
        },
        updateSet = {
            $pull: {
                cart_products: {
                    productId,
                },
            },
        };
    const deleteCart = await cart.updateOne(query, updateSet);
};

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart,
};
