import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());
app.use(express.json());
const corsConfig = {
    origin: 'https://final-hackathon-client.vercel.app',
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"]
}
app.options("",cors(corsConfig))
app.use(cors(corsConfig));
export {app}