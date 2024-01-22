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
export const io = new Server(server, ({
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

    socket.on('offer', async ( data ) => {
        try {
            const result = await pool.query('SELECT ud.socket_id from Users as ud LEFT JOIN Meetings as md on md.user_email=ud.email meeting_id=$1', [data.meetingId])
            console.log(result);
            receiver = result.rows[0].socket_id
            sender = data.UserSocketId
            sendersOffer = data.offer
            io.to(receiver).emit('acceptOffer', sendersOffer)
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('answer', (answer) => {
        io.to(sender).emit('offeraccepted', { answer })
    })

    socket.on('negotiation', (offer) => {
        io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer })
    })

    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer })
    })

    socket.on('connected', () => { io.emit('startMeeting') })
})

server.listen(process.env.PORT, () => {Notification(); console.log(`Server Running at ${process.env.PORT}`)})