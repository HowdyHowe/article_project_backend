import cors from "cors";
import dotenv from "dotenv"
import morgan from "morgan";
import express from "express"
import cookieParser from "cookie-parser";
import authRouter from "./routing/authRoutes";
import articleRouter from "./routing/articleRoutes";
import categoryRouter from "./routing/categoryRoutes";

dotenv.config({quiet: true})

const app   = express()
const PORT  = process.env.PORT

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Optional: Add a custom morgan format to see it's definitely working
app.use(morgan((tokens, req, res) => {
    const log = [
        '🔵',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
    console.log(log);
    return null;
}));

app.use("/auth", authRouter);
app.use("/article", articleRouter);
app.use("/category", categoryRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});