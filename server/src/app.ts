import express from 'express';
import http from 'http'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import pool from '../dbconnect'
const { Notification } = require('./Services/Notification');
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(require('./routers/UserRoutes'));
app.use(require('./routers/EventsRoutes'));
app.use(require('./routers/MeetingsRoutes'))
app.use(require('./routers/Payment'))
const server = http.createServer(app)
app.use(cors())
const io = new Server(server, ({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
}))

let receiver: string | string[];
let sender: string | string[];
let sendersOffer: any;

io.on('connection', (socket) => {
    socket.emit('hello', socket.id)

    socket.on('call', async ( from, offer) => {
        try {
            const reciverSocketId = await pool.query('SELECT socketid from Users WHERE zen_no=$1', [ID])
            receiver = reciverSocketId.rows[0].socketid
            sender = from
            sendersOffer = offer
            io.to(receiver).emit('pickcall')
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('recieved', () => {
        io.to(receiver).emit('recieverCall', { sendersOffer, sender })
    })

    socket.on('callrecieved', (answer) => {
        io.to(sender).emit('callaccepted', { answer, picked: true })
    })

    socket.on('negotiation', (offer) => {
        io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer })
    })

    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer })
    })

    socket.on('done', () => { io.emit('videocall') })
})

server.listen(process.env.PORT, () => {Notification(); console.log(`Server Running at ${process.env.PORT}`)})