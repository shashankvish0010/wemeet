import express from "express"
const router = express.Router()
import pool from "../../dbconnect"

router.get('/fetch/meetings/:userEmail', async (req,res) => {
    const {userEmail} = req.params
    try {
        const meetingData = await pool.query('SELECT ud.firstname, md.scheduled_time, md.scheduled_date, ed.event_name, ed.duration, ed.event_description from Users as ud INNER JOIN meetings as md on md.host_email=ud.email INNER JOIN events as ed on ed.id=md.meeting_id WHERE ed.user_email=$1',[userEmail] )
        console.log(meetingData.rows[0]);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router