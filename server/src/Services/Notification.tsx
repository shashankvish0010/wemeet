const client = require('./redis')
import pool from "../../dbconnect"

const date = new Date;     
let todayMeetings: any[]


const sortTodaysMeetings = (array: any[]) => {
    let meetings: any []
    array?.map((data) => {
        data.scheduled_time = Number(data.scheduled_time.split(':'))
    })
    console.log(array);
}

export const Notification = async () => {
    console.log("enter");
    try {
        const cacheValue = await client.get('meetings:1')
        if (cacheValue) {
            const cacheData = JSON.parse(cacheValue)
            console.log(date.toLocaleDateString().split('/'));
            const todayDate = date.toLocaleDateString().split('/');
            if(cacheData.length > 1){
                cacheData?.map((data: any) => {
                    data.scheduled_date.split('-').reverse() == todayDate ?
                    todayMeetings.push(data) : null
                })
                sortTodaysMeetings(todayMeetings)
                }
            else{
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