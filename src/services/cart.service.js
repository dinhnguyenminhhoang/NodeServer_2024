const { cart } = require("../models/cart.model");
const {
    createUserCart,
    updateUserCartQuantity,
} = require("../models/repositories/cart.repo");

class CartService {
    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: userId }).lean();
        if (!userCart) {
            return await createUserCart({ product: product, userId: userId });
        }
        // trường hợp có giỏ hàng nhưng ko có sản phẩm
        if (!userCart.cart_products.length) {
            //update
            userCart.cart_products = [product];
            return await userCart.save();
        }
        return await updateUserCartQuantity({
            product: product,
            userId: userId,
        });
        //nếu đã có sản phẩm
    }
}
module.exports = CartService;
