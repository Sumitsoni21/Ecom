const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// connect to Database

// mongoose.connect(process.env.MONGODB_URI).
//     then(() => console.log("Database Connected Successfully")).
//     catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Welcome to the Ecommerce Server.");
})

app.listen(3000, (req, res) => {
    console.log("Server started at Port 3000");
})