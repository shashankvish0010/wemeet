const client = require('./redis')
import pool from "../../dbconnect"
const schedule = require('node-schedule')
const sendEmail = require("./Email");

const date = new Date;
let meetings: any[] = []
let todayMeetings: any[] = []
let sendUpdates: any[] = []
let todayDate: any
let time: any
let reminderTime
let sendToTime

const sortTodaysMeetings = (array: any[]) => {
    console.log(array);

    array?.map((data) => {
        let currentTimeArray = data.scheduled_time.split(':')
        data.scheduled_time = Number(currentTimeArray[0] + currentTimeArray[1])
    })
    meetings = [...array]
    if (todayDate && meetings) {
        const date = new Date(Number(todayDate[2]), Number(todayDate[1]) - 1, Number(todayDate[0]), Number(String(meetings[0].scheduled_time).slice(0, 2)), Number(String(meetings[0].scheduled_time).slice(2, 4)), 0)
        time = Number(`{${date.getHours()}${date.getMinutes()}`)

        schedule.scheduleJob('* /1 * * * *', () => {
            let updateTime
            let sendTime
            for (let i = 0; i < meetings.length; i++) {
                if (time + 15 === meetings[i].scheduled_time) {
                    sendUpdates.push(meetings[i])
                    updateTime = meetings[i].scheduled_time - 15
                    sendTime = meetings[i].scheduled_time
                }
            }
            reminderTime = new Date(Number(todayDate[2]), Number(todayDate[1]) - 1, Number(todayDate[0]), Number(String(updateTime).slice(0, 2)), Number(String(updateTime).slice(2, 4)), 0)
            sendToTime = new Date(Number(todayDate[2]), Number(todayDate[1]) - 1, Number(todayDate[0]), Number(String(sendTime).slice(0, 2)), Number(String(sendTime).slice(2, 4)), 0)

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

            schedule.scheduleJob(date, () => {
                console.log("task executed");
            })
        })
    }
}


export const Notification = async () => {
    console.log("enter")
    try {
        const cacheValue = await client.get('meetings:1')
        if (cacheValue) {
            const cacheData = JSON.parse(cacheValue)
            date.getMonth() < 8 ? todayDate = [`${date.getDate()}`, `0${date.getMonth() + 1}`, `${date.getFullYear()}`]
                : todayDate = [`${date.getDate()}`, `${date.getMonth() + 1}`, `${date.getFullYear()}`]
            console.log(todayDate);

            if (cacheData.length > 1) {
                cacheData?.map((data: any) => {
                    console.log("dat", data.scheduled_date.split('-').reverse());
                    const currentDataTime = data.scheduled_date.split('-').reverse()
                    currentDataTime[0] == todayDate[0] && currentDataTime[1] == todayDate[1] ?
                        todayMeetings.push(data) : null
                })
                console.log("td", todayMeetings);

                sortTodaysMeetings(todayMeetings)
            }
            else {
                console.log(cacheData[0].toLocaleDateString().split('/'));
            }
        } else {
            const response = await pool.query('SELECT * from Meetings');
            if (response.rows.length > 0) {
                await client.set('meetings:1', JSON.stringify(response.rows))
            } else {
                console.log("No Meetings data fetched");
            }
        }
    } catch (error) {
        console.log(error);
    }
}