import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    content: {
        type: String
    },
    media:{
        public_id: {
            type: String,
            required: [true, 'public_id is required!']
        },
        url: {
            type: String,
            required: [true, 'url is required!']
        }
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