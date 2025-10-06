import express, { Application } from "express"
import authRouter from "./routing/authRoutes";
import dotenv from "dotenv"
import articleRouter from "./routing/articleRoutes";
import categoryRouter from "./routing/categoryRoutes";
import cors from "cors";

dotenv.config({quiet: true})

const app: Application  = express()
const PORT              = process.env.PORT

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
}))

app.use(express.json());

app.use("/auth", authRouter);
app.use("/article", articleRouter);
app.use("/category", categoryRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});