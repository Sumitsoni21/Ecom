const express = require("express");
const { signup, login, profile, updateProfile } = require("../controllers/userController");
const router = express.Router();


router.post("/signup", signup).post("/login", login).get("/:id", profile).put("/:id", updateProfile);


module.exports = router;