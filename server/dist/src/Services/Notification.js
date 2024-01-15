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
exports.Notification = void 0;
const client = require('./redis');
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const schedule = require('node-schedule');
const date = new Date;
let meetings = [];
let todayMeetings = [];
let todayDate;
const sortTodaysMeetings = (array) => {
    console.log(array);
    array === null || array === void 0 ? void 0 : array.map((data) => {
        let currentTimeArray = data.scheduled_time.split(':');
        data.scheduled_time = Number(currentTimeArray[0] + currentTimeArray[1]);
    });
    // meetings = [...array]
    meetings = [{ scheduled_time: 1707 }];
    if (todayDate && meetings) {
        const taskDate = `${Number(todayDate[2])}, ${Number(todayDate[1]) - 1}, ${Number(todayDate[0])}, ${Number(String(meetings[0].scheduled_time).slice(0, 2))},  ${Number(String(meetings[0].scheduled_time).slice(1, 4).slice(1, 4))}, 0`;
        const date = new Date(Number(todayDate[2]), Number(todayDate[1]) - 1, Number(todayDate[0]), Number(String(meetings[0].scheduled_time).slice(0, 2)), Number(String(meetings[0].scheduled_time).slice(2, 4)), 0);
        // const date = new Date (taskDate)
        console.log(date);
        schedule.scheduleJob(date, () => {
            console.log("task executed");
        });
    }
};
const Notification = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("enter");
    try {
        const cacheValue = yield client.get('meetings:1');
        if (cacheValue) {
            const cacheData = JSON.parse(cacheValue);
            date.getMonth() < 8 ? todayDate = [`${date.getDate()}`, `0${date.getMonth() + 1}`, `${date.getFullYear()}`]
                : todayDate = [`${date.getDate()}`, `${date.getMonth() + 1}`, `${date.getFullYear()}`];
            console.log(todayDate);
            if (cacheData.length > 1) {
                cacheData === null || cacheData === void 0 ? void 0 : cacheData.map((data) => {
                    console.log("dat", data.scheduled_date.split('-').reverse());
                    const currentDataTime = data.scheduled_date.split('-').reverse();
                    currentDataTime[0] == todayDate[0] && currentDataTime[1] == todayDate[1] ?
                        todayMeetings.push(data) : null;
                });
                console.log("td", todayMeetings);
                sortTodaysMeetings(todayMeetings);
            }
            else {
                console.log(cacheData[0].toLocaleDateString().split('/'));
            }
        }
        else {
            const response = yield dbconnect_1.default.query('SELECT * from Meetings');
            if (response.rows.length > 0) {
                yield client.set('meetings:1', JSON.stringify(response.rows));
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
exports.Notification = Notification;
