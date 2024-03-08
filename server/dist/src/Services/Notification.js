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
exports.cleanUp = void 0;
const client = require('./redis');
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const schedule = require('node-schedule');
const sendEmail = require("./Email");
const date = new Date();
const todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
let meetings = [];
let todayMeetings = [];
let sendUpdates = [];
let time;
let reminderTime;
let sendToTime;
const sortTodaysMeetings = (array) => {
    console.log("array", array);
    array === null || array === void 0 ? void 0 : array.map((data) => {
        let currentTimeArray = data.scheduled_time.split(':');
        data.scheduled_time = Number(currentTimeArray[0] + currentTimeArray[1]);
    });
    meetings = [...array];
    console.log(todayDate);
    if (todayDate && meetings.length > 0) {
        // const date = new Date(Number(todayDate[2]), Number(todayDate[1]) - 1, Number(todayDate[0]), Number(String(meetings[0].scheduled_time).slice(0, 2)), Number(String(meetings[0].scheduled_time).slice(2, 4)), 0)
        schedule.scheduleJob('0 * * * * *', () => {
            console.log("enter scheduler");
            time = Number(`${new Date().getHours()}${new Date().getMinutes()}`);
            let updateTime;
            let sendTime;
            for (let i = 0; i < meetings.length; i++) {
                console.log(time, meetings[i].scheduled_time);
                if (time + 15 == meetings[i].scheduled_time || Number(`${new Date().getHours()}${new Date().getMinutes() + 15}`) == meetings[i].scheduled_time) {
                    console.log("enter scheduler TT");
                    sendUpdates.push(meetings[i]);
                    updateTime = meetings[i].scheduled_time - 15;
                    sendTime = meetings[i].scheduled_time;
                }
            }
            if (updateTime && sendTime) {
                reminderTime = new Date(Number(date.getFullYear()), Number(date.getMonth()) + 1, Number(date.getDay()), Number(String(updateTime).slice(0, 2)), Number(String(updateTime).slice(2, 4)), 0);
                sendToTime = new Date(Number(date.getFullYear()), Number(date.getMonth()) + 1, Number(date.getDay()), Number(String(sendTime).slice(0, 2)), Number(String(sendTime).slice(2, 4)), 0);
                sendNotification(reminderTime, sendToTime);
            }
        });
    }
    else {
        console.log("No meetings today");
    }
};
const sendNotification = (reminderTime, sendToTime) => {
    schedule.scheduleJob(reminderTime, () => {
        sendUpdates === null || sendUpdates === void 0 ? void 0 : sendUpdates.map((data) => __awaiter(void 0, void 0, void 0, function* () {
            const host_email_message = {
                from: process.env.EMAIL_USER,
                to: data.host_email,
                subject: `Reminder: ${data.event_name} with ${data.user_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.user_email} at ${data.scheduled_time}`
            };
            yield sendEmail(host_email_message);
            const user_email_message = {
                from: process.env.EMAIL_USER,
                to: data.user_email,
                subject: `Reminder: ${data.event_name} with ${data.host_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.host_email} at ${data.scheduled_time}`
            };
            yield sendEmail(user_email_message);
        }));
    });
    schedule.scheduleJob(sendToTime, () => {
        sendUpdates === null || sendUpdates === void 0 ? void 0 : sendUpdates.map((data) => __awaiter(void 0, void 0, void 0, function* () {
            const host_email_message = {
                from: process.env.EMAIL_USER,
                to: data.host_email,
                subject: `Reminder: ${data.event_name} with ${data.user_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.user_email} at ${data.scheduled_time}`
            };
            yield sendEmail(host_email_message);
            const user_email_message = {
                from: process.env.EMAIL_USER,
                to: data.user_email,
                subject: `Reminder: ${data.event_name} with ${data.host_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.host_email} at ${data.scheduled_time}`
            };
            yield sendEmail(user_email_message);
            sendUpdates.pop();
        }));
        time = Number(`{${date.getHours()}${date.getMinutes()}`);
    });
};
const cleanUp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.expireat('meetings:1', 5);
        Notification();
    }
    catch (error) {
        console.log(error);
    }
});
exports.cleanUp = cleanUp;
const Notification = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("enter");
    try {
        const cacheValue = yield client.get('meetings:1');
        if (cacheValue) {
            const cacheData = JSON.parse(cacheValue);
            if (cacheData.length > 0) {
                cacheData === null || cacheData === void 0 ? void 0 : cacheData.map((data) => {
                    console.log("dat", data.scheduled_date);
                    const currentDataTime = new Date(data.scheduled_date);
                    if (currentDataTime.getTime() == todayDate.getTime()) {
                        todayMeetings.push(data);
                    }
                });
                console.log("td", todayMeetings);
                sortTodaysMeetings(todayMeetings);
            }
            else {
                console.log((_a = cacheData === null || cacheData === void 0 ? void 0 : cacheData.toLocaleDateString()) === null || _a === void 0 ? void 0 : _a.split('/'));
            }
        }
        else {
            const response = yield dbconnect_1.default.query('SELECT * from Meetings');
            if (response.rows.length > 0) {
                yield client.set('meetings:1', JSON.stringify(response.rows));
                Notification();
            }
            else {
                console.log("No Meetings data fetched");
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
