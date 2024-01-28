const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

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
    static deleteUserCart = async ({ userId, productId }) => {
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
    static async addToCartV2({ userId, product = {} }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];
        // check product found
        const foundProduct = await getProductById(productId);
        if (foundProduct) throw new NotFoundError("product not found");
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError("product not found");
        if (quantity === 0) {
            await CartService.deleteUserCart({
                productId: productId,
                userId: userId,
            });
        }
        return await updateUserCartQuantity({
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
            userId: userId,
        });
    }
    static getListUserCart = async ({ userId }) => {
        return await cart
            .findOne({
                cart_userId: +userId,
            })
            .lean();
    };
}
module.exports = CartService;
