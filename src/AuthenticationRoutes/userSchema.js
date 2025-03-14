import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "Name required at least 3 characters"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        validate: function (email) {
            return /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
        }
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password should be at least 8 characters long"]
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "gender is required"]
    },
    tokens: [{
        token: {
            type: String,
        }
    }],
    profilePicture: {
        type: String,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});
export default userSchema;
