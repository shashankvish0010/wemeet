import express from "express"
const router = express.Router()
import pool from "../../dbconnect"

router.get('/fetch/meetings/:userEmail', async (req,res) => {
    const {userEmail} = req.params
    try {
        const meetingData = await pool.query('SELECT ud.firstname, md.scheduled_time, md.scheduled_date from Users as ud left join meetings as md on md.host_email=ud.email')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router