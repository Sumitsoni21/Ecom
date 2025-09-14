const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 25,
    },
    brand: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true,
    },
    MRP: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
        validate: {
            validator: function (v) {
                return v <= this.MRP;
            },
            message: "Price cannot be greater than MRP."

        }
    },
    category: {
        type: String,
        enum: ['electronics', 'fashion', 'clothes', 'sports', 'home', 'beauty', 'miscellaneous'],
        required: true,
        default: 'miscellaneous',
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 180,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 1000,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: {
        type: [String],
        default: [],
    }


    // add ratings, reviews, reviewcount
    // can add discount and create custom method to calculate selling price 

}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);
module.exports = Product;