const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: [true, "FirstName is required"],
            minLength: 3,
            maxLength: 20,
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "LastName is required"],
            minLength: 3,
            maxLength: 20,
            trim: true,
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        // validation
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email`,
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [8, "Password must be 8 characters long"],
        validate: {
            validator: function (v) {
                // Must contain at least one uppercase, one lowercase, one number, and one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message:
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        },
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin", "super-admin", "seller"],
        default: "user",
        lowercase: true,
        trim: true,
    },
    phone: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v); // only 10 digits
            },
            message: (props) => `${props.value} is not a valid phone number!`
        },
    }


}, { timestamps: true });

userSchema.pre("save", async function (next) {
    try {
        const user = this; // this refers to the current document being saved

        if (!user.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(user.password, salt);
        user.password = encryptedPassword;
        next();

    } catch (error) {
        next(error);
    }
})

userSchema.methods.isMatchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


const User = mongoose.model("User", userSchema);
module.exports = User;