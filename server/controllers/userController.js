const User = require("../models/userModel");
const { generateToken } = require("../utils/jwtauth");


const signup = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, name } = req.body;
        if (!email || !password || !name.firstName) {
            throw new Error("Email, Password and Name is Required.");
        }

        // check if user already exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({ success: false, message: "User Already Registered." });
        }


        // save user
        const newUser = new User({ name: { firstName: name.firstName, lastName: name.lastName }, email: email, password: password, role: "user" })
        await newUser.save();

        // generate token
        const token = generateToken(newUser._id);

        res.status(201).json({ success: true, message: "User Registered Successfully.", user: newUser, token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error : " + err });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Email and Password is Required");
        }

        // check user
        const user = await User.findOne({ email }).select("+password");
        // const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(409).json({ success: false, message: "User does not exist." })
        }

        // check password

        const passwordMatch = await user.isMatchPassword(password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect Credentials." });
        }

        //(todo) generate token and return 
        const token = generateToken(user._id);

        // remove password
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(200).json({ success: true, message: "User Logged In Successfully", user: userResponse, token })

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Internal Server Error " + err });
    }
}



const profile = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {
            throw new Error("Id is Required");
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(409).json({ status: false, message: "User not Found" })
        }

        res.status(200).json({ success: true, message: "User Profile Fetched Successfully", user: user })

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}


const updateProfile = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            throw new Error("Email is Required");
        }

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: req.body }, { new: true });

        if (!updatedUser) {
            return res.status(409).json({ status: false, message: "User not Found" })
        }


        res.status(200).json({ success: true, message: "User Updated Successfully", user: updatedUser });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}


module.exports = { signup, login, profile, updateProfile };









//  try {

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }



