import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./src/db/index.js";
dotenv.config();
import { postRouter } from "./src/routes/post.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { serverRouter } from "./src/routes/server.routes.js";
app.use("/api/v1", postRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", serverRouter);
app.use("/api/v1", userRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server running on port ", process.env.PORT)
        })
    })
    .catch((err) => {
        console.log("Something went wrong", err)
    })