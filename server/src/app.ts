import express from 'express';
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT, () => console.log("Server Running"))