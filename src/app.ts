import express, { Application } from "express"
import router from "./routing/authRoutes";
import dotenv from "dotenv"

dotenv.config({quiet: true})

const app: Application = express()
const PORT = process.env.PORT

app.use(express.json());

app.use("/auth", router);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})