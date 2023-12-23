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
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const dotenv_1 = __importDefault(require("dotenv"));
const { sendEmail } = require('../Services/Email');
dotenv_1.default.config();
router.post('/create/event/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, duration, description } = req.body;
    const { id } = req.params;
    var proceed = true;
    try {
        if (!name || !duration || !description) {
            res.json({ succes: false, message: "Fill all the fields" });
        }
        else {
            const user = yield dbconnect_1.default.query('SELECT * FROM Users WHERE id=$1', [id]);
            console.log(user.rows[0].email);
            const email = user.rows[0].email;
            const isExists = yield dbconnect_1.default.query('SELECT duration FROM Events WHERE user_email=$1', [email]);
            if (isExists.rows.length > 0) {
                isExists.rows.map((fetchedDuration) => {
                    if (fetchedDuration.duration == duration) {
                        res.json({ succes: false, message: `Event of ${duration} min already exists` });
                        proceed = false;
                    }
                });
            }
            if (proceed == true) {
                const id = (0, uuid_1.v4)();
                const newEvent = yield dbconnect_1.default.query('INSERT INTO Events(id, event_name, duration, event_description, user_email, active) VALUES($1, $2, $3, $4, $5, $6)', [id, name, duration, description, email, true]);
                if (newEvent) {
                    res.json({ succes: true, message: "Event Created" });
                }
                else {
                    res.json({ succes: false, message: "Event not created" });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.get('/get/events/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield dbconnect_1.default.query('SELECT * FROM Users WHERE id=$1', [id]);
        const events = yield dbconnect_1.default.query('SELECT * FROM Events WHERE user_email=$1', [user.rows[0].email]);
        if (events.rows.length > 0) {
            res.json({ succes: true, events: events.rows, message: "Event fetched" });
        }
        else {
            res.json({ succes: false, message: "Event not fetched" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.get('/event/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        if (id) {
            const eventdata = yield dbconnect_1.default.query('SELECT * FROM Events WHERE id=$1', [id]);
            console.log(eventdata.rows);
            res.json({ success: true, eventdata: eventdata.rows, message: "Event receieved" });
        }
        else {
            res.json({ success: false, message: "Event ID not receieved" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/schedule/event/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, time, date } = req.body;
    console.log(email, time, date);
    try {
        if (id) {
            const eventdata = yield dbconnect_1.default.query('SELECT * FROM Events WHERE id=$1', [id]);
            const hostEmail = eventdata.rows[0].user_email;
            if (hostEmail) {
                const meetingId = (0, uuid_1.v4)();
                if (meetingId) {
                    yield dbconnect_1.default.query('INSERT INTO Meetings(id, user_email, host_email, scheduled_time, scheduled_date ) VALUES($1, $2, $3, $4, $5)', [meetingId, email, hostEmail, time, date]);
                    const email_message = {
                        from: process.env.EMAIL_USER,
                        to: hostEmail,
                        subject: 'Meeting Scheduled',
                        text: `Your meeting is scheduled at ${time} on ${date} so all the best. Join the meeting using http://localhost:5173/meet/${meetingId}`
                    };
                    const user_email_message = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'You Scheduled a Meeting',
                        text: `You scheduled a meeting at ${time} on ${date} so all the best. Join the meeting using http://localhost:5173/meet/${meetingId}`
                    };
                    try {
                        yield sendEmail(email_message);
                        yield sendEmail(user_email_message);
                        res.json({ success: true, message: "Meeting booked" });
                    }
                    catch (emailError) {
                        console.error("Error sending email:", emailError);
                        res.json({ success: false, message: "Error sending email", error: emailError });
                    }
                }
            }
        }
        else {
            res.json({ succes: false, message: "Host email not found" });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
