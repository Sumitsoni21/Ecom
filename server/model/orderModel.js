const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    items: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            }
        }],
        required: true,
        validate: [arr => arr.length > 0, "Order must have atleast one item"]
    },
    totalMRP: {
        type: Number,
        required: true,
        min: 0,
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "upi", "card"],
        required: true,
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;