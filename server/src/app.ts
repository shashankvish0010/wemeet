import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(require('./routers/UserRoutes'));
app.use(require('./routers/EventsRoutes'))


app.listen(process.env.PORT, () => console.log(`Server Running at ${process.env.PORT}`))