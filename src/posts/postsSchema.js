import mongoose from "mongoose";
const postsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption: {
        type: String,
        required: true,
        minLength: [5, 'caption should be atleast 5 characters long']
    },
    image: {
        type: String,
    },
    like: {
        type: Number
    },
    Comment: {
        type: [String]
    }
});
const postModel = mongoose.model('posts', postsSchema);
export default postModel;