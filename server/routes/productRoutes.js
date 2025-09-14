const express = require("express");
const { createProduct, getAllProduct, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const router = express.Router();


router.post("/", createProduct)
    .get("/", getAllProduct).
    get("/:id", getProduct).
    put("/:id", updateProduct).
    delete("/:id", deleteProduct);

module.exports = router;
