import express from 'express';
import http from 'http'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import pool from '../dbconnect'
const { cleanUp } = require('./Services/Notification');
const app = express()
const schedule = require('node-schedule')

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(require('./routers/UserRoutes'));
app.use(require('./routers/EventsRoutes'));
app.use(require('./routers/MeetingsRoutes'))
app.use(require('./routers/Payment'))
const server = http.createServer(app)
app.use(cors({
    origin: 'https://wemeet-psi.vercel.app',
    methods: ['GET', 'POST', 'PUT'],
}));
const io = new Server(server, ({
    cors: {
        origin: 'https://wemeet-psi.vercel.app',
        methods: ['GET', 'POST', 'PUT']
    }
}))

let receiver: string | string[];
let sender: string | string[];
let sendersOffer: any;

io.on('connection', (socket) => {
    socket.emit('hello', socket.id)

    socket.on('meetingCredential', async (data) => {
        const result = await pool.query('SELECT host_email FROM Meetings WHERE id=$1', [data.meetingId])
        console.log(result.rows.length);
        
        if (result.rows.length > 0) {
            if (result.rows[0].host_email == data.userEmail) {
                const hostData = await pool.query('SELECT * FROM Users WHERE email=$1', [data.userEmail])
                if (hostData.rows.length > 0) {
                    console.log("enter");
                    socket.emit('validcred', {key: true, message: "Joined Successfully"})
                    socket.broadcast.emit('userJoinedMeeting', { socket_ID: socket.id, email_address: data.userEmail, firstname: hostData.rows[0].firstname, lastname: hostData.rows[0].lastname, host: true })
                }
            } else {
                const userData = await pool.query('SELECT * FROM Users WHERE email=$1', [data.userEmail])
                if (userData.rows.length > 0) {
                    socket.emit('validcred', {key: true, message: "Joined Successfully"})
                    socket.broadcast.emit('userJoinedMeeting', { socket_ID: socket.id, email_address: data.userEmail, firstname: userData.rows[0].firstname, lastname: userData.rows[0].lastname, host: false })
                }
            }
        }else{
            socket.emit('validcred', {key: false, message: "Invalid Meeting Credentials"})
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

    socket.on('connected', () => { io.emit('startMeeting') })

    socket.on('send', (data) => {
        socket.broadcast.emit('messageFromRemote', { message: data.message, sender: true })
    })
})

server.listen(process.env.PORT, () => {
    schedule.scheduleJob('0 0 * * * ', () => cleanUp())
    console.log(`Server Running at ${process.env.PORT}`)
})