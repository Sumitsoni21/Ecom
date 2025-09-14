// add to cart 
// update cart 
// clear cart
// get cart

const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const addProductToCart = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id || req.user._id;  // get userId from jwt token 

        // validate input
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, status: "Products are Required" });
        }

        // check if user exist
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, status: "User Not Found" });
        }

        // if cart exist update the cart else create new cart
        let cart = await Cart.findOne({ user: userId });

        if (cart) {

            // if product exist then either update quantity else push product
            for (let newProduct of products) {
                const existingProduct = cart.products.find((p) => p.product.toString() === newProduct.product.toString());
                if (existingProduct) {
                    existingProduct.quantity += newProduct.quantity;
                } else {
                    cart.products.push(...products);
                }
            }
            await cart.save();
        } else {
            cart = await new Cart({ user: userId, products })
            await cart.save();
        }

        // Populate product details 
        await cart.populate("products.product");

        res.status(200).json({
            success: true, message: "Product Added to Cart Successfully",
            data: cart
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Eroor" });
    }
}

// (todo) update product handle correctly;
const updateCart = async (req, res) => {

    try {
        const { products } = req.body;
        const userId = req.user.id || req.user._id;  // get userId from jwt token 

        // validate input
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, status: "Products are Required" });
        }

        // check userId
        if (!userId) {
            return res.status(400).json({ success: false, status: "user id is Required" });
        }

        // check if user exist
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, status: "User Not Found" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(400).json({ success: false, status: "Cart Not Found" });
        }

        const newCart = {
            user: userId,
            products: products,
        }

        const updatedCart = await Cart.findByIdAndUpdate(cart._id, newCart, { new: true, runValidators: true });

        // Populate product details 
        await updatedCart.populate("products.product");

        res.status(200).json({ success: true, message: "Cart Updated Successfully", data: updatedCart })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Eroor" });

    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;  // get userId from jwt token 
        if (!userId) {
            throw new Error("userID is Required");
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }

        //  correct logic
        const cart = await Cart.find({ user: userId }).populate("products.product");;
        if (!cart) {
            return res.status(400).json({ success: false, message: "Cart Not Found" })
        }

        res.status(200).json({ success: true, message: "Cart fetched Successfully", data: cart });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}




const clearCart = async (req, res) => {
    try {

        // write to clear or delete complete cart




    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { addProductToCart, getCart, clearCart, updateCart }