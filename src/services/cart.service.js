const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { updateUserCartQuantity } = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: +userId });
        if (!userCart) {
            return await CartService.createUserCart({
                product: product,
                userId: userId,
            });
        }
        // trường hợp có giỏ hàng nhưng ko có sản phẩm
        if (!userCart.cart_products.length) {
            //update
            userCart.cart_products = [product];
            userCart.cart_count_product = 0;
            return await userCart.save();
        }
        return await updateUserCartQuantity({
            product: product,
            userId: userId,
        });
        //nếu đã có sản phẩm
    }

    static createUserCart = async ({ userId, product }) => {
        const query = {
                cart_userId: +userId,
                cart_state: "active",
            },
            updateOrInsert = {
                $addToSet: { cart_products: product },
            },
            options = {
                upsert: true,
                new: true,
            };
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    };
    static deleteCartItem = async ({ userId, productId }) => {
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
        return deleteCart;
    };
    static async addToCartV2({ shop_order_ids, userId }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.items_products[0];
        // check product found
        const foundProduct = await getProductById(productId);
        console;
        if (!foundProduct) throw new NotFoundError("product not found");
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError("product not found");
        if (quantity === 0) {
            await CartService.deleteCartItem({
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
