
// for users: create, update(cancel) and fetch order(single and all);

const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

//  create order 
const placeOrderFromCart = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { paymentMethod, } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ success: false, message: "Payment Method is Empty" });

        }

        // fetch cart 
        const cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is Empty" });
        }

        // prepare order data
        // items, paymentMethod,totalPrice , totalMRP, user

        let totalPrice = 0;
        let totalMRP = 0;

        // check stock availability
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient Stock for ${item.product.name}, only ${item.product.stock} left` })
            }
        }

        // calculate totalPrice,totalMRP of cart and deduct stock
        for (let item of cart.products) {
            totalPrice += item.quantity * item.product.price;
            totalMRP += item.quantity * item.product.MRP;

            // update stock
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
        }

        // array of items 
        let items = cart.products.map((item) => ({ product: item.product._id, quantity: item.quantity, price: item.product.price }))

        // create order
        const order = await Order.create({ user: userId, items: items, totalMRP, totalPrice, paymentMethod });

        // clear cart items (or delete cart)
        const deleteCart = await Cart.findByIdAndDelete(cart._id);

        res.status(200).json({ success: true, message: "Order Placed Successfully", data: order });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// update basically for changing status
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order id is empty" })
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ success: false, message: "No Order Details Found" })
        }

        order.status = status || order.status;
        await order.save();

        res.status(200).json({ success: true, message: "Order Status Updated Successfully" })


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// users all order
const fetchUserOrder = async (req, res) => {
    try {

        const userId = req.user.id || req.user._id;

        const orders = await Order.find({ user: userId });
        if (!orders) {
            return res.status(400).json({ success: false, message: "No Order Found" })
        }

        res.status(200).json({ success: true, message: "Orders fetched Successfully", data: orders });


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// single order
const fetchOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order id is required" })
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(400).json({ success: false, message: "Order not Found" });
        }

        return res.status(200).json({ success: true, message: "Order Fetched Successfully", data: order })


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

// delete order admin access only (later)

module.exports = { placeOrderFromCart, updateOrderStatus, fetchOrder, fetchUserOrder }