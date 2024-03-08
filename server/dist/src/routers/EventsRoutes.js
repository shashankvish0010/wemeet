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
const Notification_1 = require("../Services/Notification");
const router = express_1.default.Router();
const dotenv_1 = __importDefault(require("dotenv"));
const { sendEmail } = require('../Services/Email');
const client = require('../Services/redis');
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
            const cacheValue = yield client.get('currenteventdata:1');
            if (cacheValue) {
                console.log("events", cacheValue);
                res.json({ success: true, eventdata: JSON.parse(cacheValue), message: "Event receieved" });
            }
            else {
                const eventdata = yield dbconnect_1.default.query('SELECT usd.firstname, usd.lastname, ed.event_name, ed.duration, ed.event_description FROM Users as usd left join Events as ed on usd.email=ed.user_email WHERE ed.id=$1 ', [id]);
                res.json({ success: true, eventdata: eventdata.rows, message: "Event receieved" });
                yield client.set('currenteventdata:1', JSON.stringify(eventdata.rows));
            }
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
    const activeDate = new Date();
    const todayDate = [`${activeDate.getFullYear()}`, `0${activeDate.getMonth() + 1}`, `${activeDate.getDate() - 1}`];
    const userDate = date.slice(0, 10).split('-');
    try {
        if (id) {
            // if (todayDate[1] == userDate[1] && todayDate[2] == userDate[2] || todayDate[1] == userDate[1] && todayDate[2] > userDate[2]) {
            //     res.json({ success: false, message: "Please choose next date, it must be tommorrow or later" })
            // } else {
            let hostEmail;
            const eventdata = yield dbconnect_1.default.query('SELECT * FROM Events WHERE id=$1', [id]);
            hostEmail = eventdata.rows[0].user_email;
            const meetingId = (0, uuid_1.v4)();
            if (meetingId) {
                yield dbconnect_1.default.query('INSERT INTO Meetings(id, meeting_id, user_email, host_email, scheduled_time, scheduled_date ) VALUES($1, $2, $3, $4, $5, $6)', [meetingId, id, email, hostEmail, time, date]);
                yield (0, Notification_1.cleanUp)();
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
                    yield client.expireat('allmeetings:1', 5);
                }
                catch (emailError) {
                    console.error("Error sending email:", emailError);
                    res.json({ success: false, message: "Error sending email", error: emailError });
                }
            }
            // }
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
