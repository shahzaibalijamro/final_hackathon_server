import express from "express"
import {  deleteUser, loginUser,registerUser, registerUserWithProfilePicture} from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyRequest } from "../middlewares/auth.middlewares.js";
const userRouter = express.Router();

//register User
userRouter.post("/register",upload.single("profilePicture"), registerUserWithProfilePicture)

//login User
userRouter.post("/login", loginUser)

//delete User
userRouter.delete("/delete", verifyRequest, deleteUser)

export { userRouter }