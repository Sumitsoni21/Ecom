

// - [ ]  `POST /api/products` → create product (admin only)
// - [ ]  `GET /api/products` → get all products
// - [ ]  `GET /api/products/:id` → get single product by ID
// - [ ]  `PUT /api/products/:id` → update product (admin only)
// - [ ]  `DELETE /api/products/:id` → delete product (admin only)

const Product = require("../models/productModel");
const User = require("../models/userModel");

const createProduct = async (req, res) => {
    try {
        const { name, brand, MRP, price, category, description, stock, seller, images } = req.body;

        if (!name || !brand || !MRP || !price || !category || !description || !stock || !seller) {
            throw new Error("Incomplete Details of Product");
        }

        // fetch user to check whether he is seller or not 
        const user = await User.findById(seller);

        if (!user) {
            return res.status(409).json({ success: false, message: "User does not exist." })

        }
        // check seller
        if (user.role !== "seller") {
            return res.status(400).json({ success: false, message: "The User is not applicable to be used as seller" })
        }

        const product = new Product({ name, brand, MRP, price, category, description, stock, seller, images });
        await product.save();

        res.status(201).json({ success: true, message: "Product Created Successfully", data: product });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error: " + error })
    }

}

const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            throw new Error("Product Id is Required")
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        res.status(200).json({ success: false, message: "Product Deleted Successfully", data: deletedProduct });


    } catch (error) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, message: "Products Fetched Successfully", data: products })

    } catch (error) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }

}


const getProduct = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            throw new Error("Product Id is Required");
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }

        res.status(200).json({ success: false, message: "Product Fetched Successfully", data: product });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        if (!id) {
            throw new Error("Product Id is Required");
        }

        const productExist = await Product.findById(id);

        if (!productExist) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }

        // write code to update
        const updatedProduct = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });

        res.status(200).json({ success: true, message: "Product Updated Successfully", data: updatedProduct })

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = { createProduct, deleteProduct, getProduct, getAllProduct, updateProduct }