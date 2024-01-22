import express from "express"
const router = express.Router()
import pool from "../../dbconnect"
const client = require('../Services/redis')
const { sendEmail } = require("../Services/Email")
const { schedule } = require('node-schedule')

router.get('/fetch/meetings/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    console.log(userEmail);
    try {
        const cacheValue = await client.get('allmeetings:1')        
        if (cacheValue) {
            if (cacheValue.length > 0) {
                res.json({ success: true, meetingData: JSON.parse(cacheValue), message: "Meeting data fetched successfully" })
            } else {
                res.json({ success: false, message: "No meetings are scheduled" })
            }
        } else {
            const meetingData = await pool.query('SELECT ud.firstname, md.scheduled_time, md.scheduled_date, md.host_email, ed.event_name, ed.duration, ed.event_description from events as ed INNER JOIN meetings as md on md.host_email=ed.user_email INNER JOIN users as ud on md.host_email=ud.email')
            if (meetingData.rows.length > 0) {                
                await client.set('allmeetings:1', JSON.stringify(meetingData.rows))
                res.json({ success: true, meetingData: meetingData.rows, message: "Meeting data fetched successfully" })
            } else {
                res.json({ success: false, message: "No meetings are scheduled" })
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/get/meeting/cred/:email', async (req,res) => {
    try {
        const {email} = req.params;
        const {meetingId, meetingPassword} = req.body;
        if(email && meetingId && meetingPassword){
            try {
                const result = await pool.query('SELECT * FROM Meetings WHERE meeting_id=$1', [meetingId]);
                if(result.rows.length > 0){
                    result.rows[0].host_email == email ? res.json({success: true, host: true, message: "Host connecting..."}) : res.json({success: false, host: false, message: "User connecting..."})
                }
            } catch (error) {
                console.log(error);
            }
        }else{
            res.json({success: false, message: "Fill all the fields"})
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router