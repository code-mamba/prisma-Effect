import express, {Application, Express, Request, Response} from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./ticket/ticket.router"

dotenv.config()
const app: Application = express()
const port = process.env.API_PORT || 8000

app.use(express.json())

app.use(cors())
app.use("/",router)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})