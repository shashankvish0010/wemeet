"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dbconnect_1 = __importDefault(require("../dbconnect"));
const { Notification } = require('./Services/Notification');
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(require('./routers/UserRoutes'));
app.use(require('./routers/EventsRoutes'));
app.use(require('./routers/MeetingsRoutes'));
app.use(require('./routers/Payment'));
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
const io = new socket_io_1.Server(server, ({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
}));
let receiver;
let sender;
let sendersOffer;
io.on('connection', (socket) => {
    socket.emit('hello', socket.id);
    socket.on('meetingCredential', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield dbconnect_1.default.query('SELECT host_email FROM Meetings WHERE meeting_id=$1', [data.meetingId]);
        if (result.rows.length > 0) {
            if (result.rows[0].host_email == data.userEmail) {
                const hostData = yield dbconnect_1.default.query('SELECT * FROM Users WHERE email=$1', [data.userEmail]);
                if (hostData.rows.length > 0) {
                    socket.emit('validcred');
                    socket.broadcast.emit('userJoinedMeeting', { socket_ID: socket.id, email_address: data.userEmail, firstname: hostData.rows[0].firstname, lastname: hostData.rows[0].lastname, host: true });
                }
            }
            else {
                const userData = yield dbconnect_1.default.query('SELECT * FROM Users WHERE email=$1', [data.userEmail]);
                if (userData.rows.length > 0) {
                    socket.emit('validcred');
                    socket.broadcast.emit('userJoinedMeeting', { socket_ID: socket.id, email_address: data.userEmail, firstname: userData.rows[0].firstname, lastname: userData.rows[0].lastname, host: false });
                }
            }
        }
    }));
    socket.on('offer', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            receiver = data.remoteSocketId;
            sender = data.UserSocketId;
            sendersOffer = data.offer;
            console.log("send:", sender, "recv:", receiver);
            io.to(receiver).emit('acceptOffer', sendersOffer);
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on('answer', (answer) => {
        io.to(sender).emit('offeraccepted', { answer });
    });
    socket.on('connected', () => { io.emit('startMeeting'); });
    socket.on('send', (data) => {
        socket.broadcast.emit('messageFromRemote', { message: data.message, sender: true });
    });
});
server.listen(process.env.PORT, () => { Notification(); console.log(`Server Running at ${process.env.PORT}`); });
