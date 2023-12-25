import express from "express"
const router = express.Router()
import pool from "../../dbconnect"

router.get('/fetch/meetings/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    console.log(userEmail);
    try {
        const meetingData = await pool.query('SELECT ud.firstname, md.scheduled_time, md.scheduled_date, ed.event_name, ed.duration, ed.event_description from events as ed INNER JOIN meetings as md on md.host_email=ed.user_email INNER JOIN users as ud on md.host_email=ud.email')
        if (meetingData.rows.length > 0) {
            res.json({ success: true, meetingData: meetingData.rows, message: "Meeting data fetched successfully" })
        } else {
            res.json({ success: false, message: "No meetings are scheduled" })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router