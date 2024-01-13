const client = require('./redis')
import pool from "../../dbconnect"

const date = new Date;
let todayMeetings: any[] = []
let todayDate: any

const sortTodaysMeetings = (array: any[]) => {
    let meetings: any[] = []
    console.log(array);

    array?.map((data) => {
        let currentTimeArray = data.scheduled_time.split(':')
        data.scheduled_time = Number(currentTimeArray[0] + currentTimeArray[1])
    })
    console.log(array);
    
}

export const Notification = async () => {
    console.log("enter");
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