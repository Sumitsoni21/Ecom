
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {

    // 1. fetch token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Token Not Found" });
    }

    try {
        // 2. verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. send user
        req.user = decoded;
        console.log(req.user);

        // (todo fetch user from db then send)
        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({ success: false, message: "Invalid or Expired Token" })
    }
}


// authenticateAdmin
const authenticateAdmin = (req, res, next) => {


}

module.exports = { authenticateUser }