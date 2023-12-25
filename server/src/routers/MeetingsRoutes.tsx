import express from "express"
const router = express.Router()
import pool from "../../dbconnect"

router.get('/fetch/meetings/:userEmail', async (req,res) => {
    const {userEmail} = req.params
    try {
        const meetingData = await pool.query('SELECT from Users as ud left join meetings as md on md.host_email=ud.email where ')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router