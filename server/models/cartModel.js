const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            // price: {
            //     type: Number,
            //     required: true,
            //     min: 0,
            // },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                max: 100,
            },
        }
    ],
    totalAmount: {
        type: Number,
        // required: true,
        min: 0,
    }

}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;