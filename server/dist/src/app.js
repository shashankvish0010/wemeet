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
exports.io = void 0;
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
exports.io = new socket_io_1.Server(server, ({
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
}));
let receiver;
let sender;
let sendersOffer;
exports.io.on('connection', (socket) => {
    socket.emit('hello', socket.id);
    socket.on('offer', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield dbconnect_1.default.query('SELECT ud.socket_id from Users as ud LEFT JOIN Meetings as md on md.user_email=ud.email meeting_id=$1', [data.meetingId]);
            console.log(result);
            receiver = result.rows[0].socket_id;
            sender = data.UserSocketId;
            sendersOffer = data.offer;
            exports.io.to(receiver).emit('acceptOffer', sendersOffer);
        }
        catch (error) {
            console.log(error);
        }
    }));
    socket.on('answer', (answer) => {
        exports.io.to(sender).emit('offeraccepted', { answer });
    });
    socket.on('negotiation', (offer) => {
        exports.io.to(receiver).emit('negotiationaccept', { sendersNegoOffer: offer });
    });
    socket.on('negotiationdone', (answer) => {
        exports.io.to(sender).emit('acceptnegotiationanswer', { receiverNegoAnswer: answer });
    });
    socket.on('connected', () => { exports.io.emit('startMeeting'); });
});
server.listen(process.env.PORT, () => { Notification(); console.log(`Server Running at ${process.env.PORT}`); });
