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

    socket.on('meetingCredential', async (data) => {
        console.log(data);
        const result = await pool.query('SELECT host_email FROM Meetings WHERE meeting_id=$1', [data.meetingId])
        if (result.rows.length > 0) {
            if (result.rows[0].host_email == data.userEmail) {
                console.log(true, data.userEmail);

                socket.emit('validcred')
                socket.broadcast.emit('userJoinedMeeting', { socket_ID: socket.id, email_address: data.userEmail, host: true })
            } else {
                socket.emit('validcred')
                socket.broadcast.emit('userJoinedMeeting', { socket_ID: socket.id, host: false })
            }
        }
    })

    socket.on('offer', async (data) => {
        try {
            receiver = data.remoteSocketId
            sender = data.UserSocketId
            sendersOffer = data.offer
            console.log("send:", sender, "recv:", receiver);

            io.to(receiver).emit('acceptOffer', sendersOffer)
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('answer', (answer) => {
        io.to(sender).emit('offeraccepted', { answer })
    })

    socket.on('negotiaionOffer', (offer) => {
        io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer })
    })

    socket.on('negotiationdone', (answer) => {
        io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer })
    })

    socket.on('getRemoteUser', async (data) => {
        const userData = await pool.query('SELECT * FROM Users WHERE email=$1', [data.email])
        if (userData.rows.length > 0) {
            const remoteUser = { firstname: userData.rows[0].firstname, lastname: userData.rows[0].lastname };
            socket.emit('remoteUser', remoteUser)
        }
    })

    socket.on('send', (data) => {
        socket.broadcast.emit('messageFromRemote', {message: data.message})
    })

    socket.on('connected', () => { io.emit('startMeeting') })
})

server.listen(process.env.PORT, () => { Notification(); console.log(`Server Running at ${process.env.PORT}`) })