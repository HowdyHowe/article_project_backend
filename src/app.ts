import express, { Request, Response } from "express"

const app = express()
const PORT = 3000

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("hello")
});

app.get("/hello", (req: Request, res: Response) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
})

app.get("/test", (req: Request, res:Response) => {
    res.send("contoh nomor 2")
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})