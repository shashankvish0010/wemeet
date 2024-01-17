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
const router = express_1.default.Router();
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const client = require('../Services/redis');
const { sendEmail } = require("../Services/Email");
const { schedule } = require('node-schedule');
router.get('/fetch/meetings/:userEmail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.params;
    console.log(userEmail);
    try {
        const cacheValue = yield client.get('allmeetings:1');
        if (cacheValue) {
            if (cacheValue.length > 0) {
                res.json({ success: true, meetingData: JSON.parse(cacheValue), message: "Meeting data fetched successfully" });
            }
            else {
                res.json({ success: false, message: "No meetings are scheduled" });
            }
        }
        else {
            const meetingData = yield dbconnect_1.default.query('SELECT ud.firstname, md.scheduled_time, md.scheduled_date, md.host_email, ed.event_name, ed.duration, ed.event_description from events as ed INNER JOIN meetings as md on md.host_email=ed.user_email INNER JOIN users as ud on md.host_email=ud.email');
            if (meetingData.rows.length > 0) {
                yield client.set('allmeetings:1', JSON.stringify(meetingData.rows));
                res.json({ success: true, meetingData: meetingData.rows, message: "Meeting data fetched successfully" });
            }
            else {
                res.json({ success: false, message: "No meetings are scheduled" });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
