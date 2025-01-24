import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String
    },
    media:{
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author Id is required!"]
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
},{timestamps:true});

export default mongoose.model("Post",postSchema);