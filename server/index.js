const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// connect to Database
mongoose.connect(process.env.MONGODB_URI).
    then(() => console.log("Database Connected Successfully")).
    catch((err) => console.log(err));

// middlewares

app.use(express.json()); // to parse Json

app.get("/", (req, res) => {
    res.send("Welcome to the Ecommerce Server.");
});


// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(3000, (req, res) => {
    console.log("Server started at Port 3000");
})