import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
// const corsConfig = {
//     origin: 'https://simple-social-media-app-six.vercel.app',
//     credentials: true,
//     methods: ["GET","POST","PUT","DELETE"]
// }
// app.options("",cors(corsConfig))
app.use(cors());
// app.use(cors(corsConfig));
export {app}