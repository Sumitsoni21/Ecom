const express = require("express");
const { authenticateUser } = require("../middlewares/auth");
const { fetchUserOrder, fetchOrder, updateOrderStatus, placeOrderFromCart } = require("../controllers/orderController");
const router = express.Router();

router.post("/", authenticateUser, placeOrderFromCart)
    .get("/", authenticateUser, fetchUserOrder)
    .get("/:id", authenticateUser, fetchOrder)
    .put("/:id", authenticateUser, updateOrderStatus)

module.exports = router;