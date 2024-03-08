const client = require('./redis')
import pool from "../../dbconnect"
const schedule = require('node-schedule')
const sendEmail = require("./Email");

const date = new Date();
const todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
let meetings: any[] = []
let todayMeetings: any[] = []
let sendUpdates: any[] = []
let time: any
let reminderTime
let sendToTime

const sortTodaysMeetings = (array: any[]) => {
    console.log("array", array);

    array?.map((data) => {
        let currentTimeArray = data.scheduled_time.split(':')
        data.scheduled_time = Number(currentTimeArray[0] + currentTimeArray[1])
    })
    meetings = [...array]
    console.log(todayDate);

    if (todayDate && meetings.length > 0) {
        // const date = new Date(Number(todayDate[2]), Number(todayDate[1]) - 1, Number(todayDate[0]), Number(String(meetings[0].scheduled_time).slice(0, 2)), Number(String(meetings[0].scheduled_time).slice(2, 4)), 0)
        schedule.scheduleJob('0 * * * * *', () => {
            console.log("enter scheduler");
            time = Number(`${new Date().getHours()}${new Date().getMinutes()}`)
            let updateTime
            let sendTime
            for (let i = 0; i < meetings.length; i++) {
                console.log(time, meetings[i].scheduled_time);
                if (time + 15 == meetings[i].scheduled_time || Number(`${new Date().getHours()}${new Date().getMinutes() + 15}`) == meetings[i].scheduled_time) {
                    console.log("enter scheduler TT");
                    sendUpdates.push(meetings[i])
                    updateTime = meetings[i].scheduled_time - 15
                    sendTime = meetings[i].scheduled_time
                }
            }
            if (updateTime && sendTime) {
                reminderTime = new Date(Number(date.getFullYear()), Number(date.getMonth()) + 1, Number(date.getDay()), Number(String(updateTime).slice(0, 2)), Number(String(updateTime).slice(2, 4)), 0)
                sendToTime = new Date(Number(date.getFullYear()), Number(date.getMonth()) + 1, Number(date.getDay()), Number(String(sendTime).slice(0, 2)), Number(String(sendTime).slice(2, 4)), 0)
                sendNotification(reminderTime, sendToTime)
            }
        })
    } else {
        console.log("No meetings today");
    }
}

const sendNotification = (reminderTime: Date, sendToTime: Date) => {
    schedule.scheduleJob(reminderTime, () => {
        sendUpdates?.map(async (data) => {
            const host_email_message = {
                from: process.env.EMAIL_USER,
                to: data.host_email,
                subject: `Reminder: ${data.event_name} with ${data.user_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.user_email} at ${data.scheduled_time}`
            }
            await sendEmail(host_email_message);
            const user_email_message = {
                from: process.env.EMAIL_USER,
                to: data.user_email,
                subject: `Reminder: ${data.event_name} with ${data.host_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.host_email} at ${data.scheduled_time}`
            }
            await sendEmail(user_email_message);
        })
    })

    schedule.scheduleJob(sendToTime, () => {
        sendUpdates?.map(async (data) => {
            const host_email_message = {
                from: process.env.EMAIL_USER,
                to: data.host_email,
                subject: `Reminder: ${data.event_name} with ${data.user_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.user_email} at ${data.scheduled_time}`
            }
            await sendEmail(host_email_message);
            const user_email_message = {
                from: process.env.EMAIL_USER,
                to: data.user_email,
                subject: `Reminder: ${data.event_name} with ${data.host_email}`,
                text: `Hi, This is a friendly reminder for the ${data.event_name} with ${data.host_email} at ${data.scheduled_time}`
            }
            await sendEmail(user_email_message);
            sendUpdates.pop()
        })
        time = Number(`{${date.getHours()}${date.getMinutes()}`)
    })
}

export const cleanUp = async () => {
    try {
        await client.expireat('meetings:1', 5)
        Notification()
    } catch (error) {
        console.log(error);
    }
}

const Notification = async () => {
    console.log("enter")
    try {
        const cacheValue = await client.get('meetings:1')
        if (cacheValue) {
            const cacheData = JSON.parse(cacheValue)
            if (cacheData.length > 0) {
                cacheData?.map((data: any) => {
                    console.log("dat", data.scheduled_date);
                    const currentDataTime = new Date(data.scheduled_date)
                    if (currentDataTime.getTime() == todayDate.getTime()) {
                        todayMeetings.push(data)
                    }
                })
                console.log("td", todayMeetings);
                sortTodaysMeetings(todayMeetings)
            }
            else {
                console.log(cacheData?.toLocaleDateString()?.split('/'));
            }
        } else {
            const response = await pool.query('SELECT * from Meetings');
            if (response.rows.length > 0) {
                await client.set('meetings:1', JSON.stringify(response.rows))
                Notification()
            } else {
                console.log("No Meetings data fetched");
            }
        }
    } catch (error) {
        console.log(error);
    }
}