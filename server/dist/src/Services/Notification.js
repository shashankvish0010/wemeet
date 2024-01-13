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
const date = new Date;
let todayMeetings;
const sortTodaysMeetings = (array) => {
    let meetings;
    array === null || array === void 0 ? void 0 : array.map((data) => {
        data.scheduled_time = Number(data.scheduled_time.split(':'));
    });
    console.log(array);
};
const Notification = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("enter");
    try {
        const cacheValue = yield client.get('meetings:1');
        if (cacheValue) {
            const cacheData = JSON.parse(cacheValue);
            console.log(date.toLocaleDateString().split('/'));
            const todayDate = date.toLocaleDateString().split('/');
            if (cacheData.length > 1) {
                cacheData.map((data) => {
                    data.scheduled_date.split('-').reverse() == todayDate ?
                        todayMeetings.push(data) : null;
                });
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
