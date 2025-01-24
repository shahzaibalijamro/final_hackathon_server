import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Username is required!'],
    },
    userName: {
        type: String,
        required: [true, 'Username is required!'],
        unique: [true, 'Username must be unique!'],
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: [true, 'Email must be unique!'],
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: props => `${props.value} is not a valid email address!`,
        }
    },
    profilePicture: {
        public_id: {
            type: String,
            required: [true, 'public_id is required!']
        },
        url: {
            type: String,
            required: [true, 'url is required!']
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
    }]
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified()) return next()
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    try {
        if (!regex.test(this.password)) return next(new Error("Password does not meet the required criteria"));
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

export default mongoose.model("User", userSchema, 'users')