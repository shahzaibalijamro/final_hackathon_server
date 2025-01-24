import mongoose from "mongoose";
import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import Like from "../models/like.models.js";
import Comment from "../models/comment.models.js"
import { uploadImageToCloudinary } from "../utils/cloudinary.utils.js";

const createPost = async (req, res) => {
    const { content } = req.body;
    const user = req.user;
    const file = req.file ? req.file.buffer : "";
    const accessToken = req.tokens ? req.tokens.accessToken : "";
    let session;
    try {
        if ((!content || content.trim() === "") && !file) {
            return res.status(400).json({
                message: "A post must consist of either text or media or both!"
            })
        }
        let media;
        if (file) {
            media = await uploadImageToCloudinary(file);
            if (!media) {
                return res.status(500).json({
                    message: "Could not upload media!"
                })
            }
        }
        session = await mongoose.startSession();
        session.startTransaction();
        //create post
        const post = await Post.create([{
            content: content || "",
            media: media || "",
            userId: user._id,
        }], { session });
        //update user posts
        await User.findByIdAndUpdate(user._id, { $push: { posts: post[0]._id } }, { session });
        await session.commitTransaction();
        return res.status(200).json({
            message: "Post created!",
            post: post[0],
            ...(accessToken && { accessToken })
        })
    } catch (error) {
        console.log(error);
        if (session) await session.abortTransaction();
        return res.status(500).json({
            message: "Something went wrong!"
        })
    } finally {
        if (session) await session.endSession();
    }
}

const likePost = async (req, res) => {
    const user = req.user;
    const { postId } = req.params;
    const accessToken = req.tokens ? req.tokens.accessToken : "";
    try {
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Post Id is required and must be valid!"
            })
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post does not exist!"
            })
        };
        const isLikedAlready = post.likes.includes(user._id);
        if (isLikedAlready) {
            const unLike = await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } }, { new: true });
            return res.status(200).json({
                message: "Post Unliked",
                unLike,
            })
        }
        const like = await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } }, { new: true });
        return res.status(200).json({
            message: "Post liked",
            like,
            ...(accessToken && { accessToken })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

const getAllPosts = async (req, res) => {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (+page - 1) * +limit;
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate([
            { path: 'userId', select: 'userName' },
            {
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'userId',
                    select: 'userName'
                }
            }]
        );
        if (posts.length === 0) return res.status(200).json({
            message: "You're all caught up!"
        })
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
        })
    }
}

const addComment = async (req, res) => {
    const { text } = req.body;
    const { postId } = req.params;
    const user = req.user;
    const accessToken = req.tokens ? req.tokens.accessToken : "";
    let session;
    try {
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: "Post Id is required and must be valid!"
            })
        }
        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Comment text is required!"
            })
        }
        session = await mongoose.startSession();
        session.startTransaction();
        const post = await Post.findById(postId).session(session);
        if (!post) {
            await session.abortTransaction()
            return res.status(404).json({
                message: "Post does not exist!"
            })
        }
        const comment = await Comment.create([{
            userId: user._id,
            postId,
            text,
        }], { session });
        //update Post comments
        await Post.findByIdAndUpdate(post._id, { $push: { comments: comment[0]._id } }, { session });
        await session.commitTransaction();
        return res.status(200).json({
            message: "Comment added",
            ...(accessToken && { accessToken })
        })
    } catch (error) {
        console.log(error);
        if (session) await session.abortTransaction()
        return res.status(500).json({
            message: "Something went wrong!"
        })
    } finally {
        if (session) await session.endSession()
    }
}

const getMyPosts = async (req, res) => {
    const { userName } = req.query;
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const skip = (+page - 1) * +limit;
    console.log(req.params);
    console.log(req.query);
    if (!userName) {
        return res.status(400).json({
            message: "Username is required!"
        })
    }
    try {
        const user = await User.findOne({ userName }).populate({
            path: 'posts',
            options: {
                skip,
                limit,
            },
            populate: {
                path: 'comments',
                populate: {
                    path: 'userId',
                    select: "userName"
                }
            }
        });
        console.log(user);
        if (!user) {
            return res.status(404).json({
                message: "User does not exist!"
            })
        }
        if (user.posts.length === 0) return res.status(200).json({
            user,
            message: "You're all caught up!"
        })
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export { createPost, likePost, getAllPosts, addComment, getMyPosts }