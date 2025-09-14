const express = require("express");
const { addProductToCart, getCart, clearCart, updateCart } = require("../controllers/cartController");
const { authenticateUser } = require("../middlewares/auth");
const router = express.Router();

router.post("/", authenticateUser, addProductToCart)
    .get("/", authenticateUser, getCart)
    .put("/", authenticateUser, updateCart)
    .delete("/", authenticateUser, clearCart);

module.exports = router;        