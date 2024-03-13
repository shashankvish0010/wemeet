import express from 'express';
import pool from '../../dbconnect';
import { v4 as uuidv4 } from 'uuid'
import { cleanUp } from '../Services/Notification';
const router = express.Router();
import dotenv from 'dotenv'
const { sendEmail } = require('../Services/Email');
const client = require('../Services/redis')
dotenv.config()

router.post('/create/event/:id', async (req: any, res: any) => {
    const { name, duration, description } = req.body;
    const { id } = req.params;
    var proceed: boolean = true;
    try {
        if (!name || !duration || !description) {
            res.json({ succes: false, message: "Fill all the fields" })
        } else {
            const user = await pool.query('SELECT * FROM Users WHERE id=$1', [id])
            console.log(user.rows[0].email);

            const email = user.rows[0].email;
            const isExists = await pool.query('SELECT duration FROM Events WHERE user_email=$1', [email]);
            if (isExists.rows.length > 0) {
                isExists.rows.map((fetchedDuration) => {
                    if (fetchedDuration.duration == duration) {
                        res.json({ succes: false, message: `Event of ${duration} min already exists` });
                        proceed = false
                    }
                })
            } if (proceed == true) {
                const id = uuidv4()
                const newEvent = await pool.query('INSERT INTO Events(id, event_name, duration, event_description, user_email, active) VALUES($1, $2, $3, $4, $5, $6)', [id, name, duration, description, email, true]);
                if (newEvent) {
                    res.json({ succes: true, message: "Event Created" })
                } else {
                    res.json({ succes: false, message: "Event not created" })
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}
)

router.get('/get/events/:id', async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM Users WHERE id=$1', [id]);
        const events = await pool.query('SELECT * FROM Events WHERE user_email=$1', [user.rows[0].email])
        if (events.rows.length > 0) {
            res.json({ succes: true, events: events.rows, message: "Event fetched" })
        } else {
            res.json({ succes: false, message: "Event not fetched" })
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/event/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        if (id) {
                const eventdata = await pool.query('SELECT usd.firstname, usd.lastname, ed.event_name, ed.duration, ed.event_description FROM Users as usd left join Events as ed on usd.email=ed.user_email WHERE ed.id=$1 ', [id]);
                res.json({ success: true, eventdata: eventdata.rows, message: "Event receieved" })
        } else {
            res.json({ success: false, message: "Event ID not receieved" })
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/schedule/event/:id', async (req, res) => {
    const { id } = req.params;
    const { email, time, date } = req.body
    const activeDate = new Date();
    const todayDate = [`${activeDate.getFullYear()}`, `0${activeDate.getMonth() + 1}`, `${activeDate.getDate() - 1}`]
    const userDate = date.slice(0, 10).split('-');
    try {
        if (id) {
            if (todayDate[1] == userDate[1] && todayDate[2] == userDate[2] || todayDate[1] == userDate[1] && todayDate[2] > userDate[2]) {
                res.json({ success: false, message: "Please choose next date, it must be tommorrow or later" })
            } else {
            let hostEmail
            const eventdata = await pool.query('SELECT * FROM Events WHERE id=$1', [id]);
            hostEmail = eventdata.rows[0].user_email
            if(email == hostEmail) {
                res.json({ success: false, message: "You cannot book your own event" })
            } else {
            const meetingId = uuidv4();
            if (meetingId) {
                await pool.query('INSERT INTO Meetings(id, meeting_id, user_email, host_email, scheduled_time, scheduled_date ) VALUES($1, $2, $3, $4, $5, $6)',
                    [meetingId, id, email, hostEmail, time, date])
                await cleanUp()
                const email_message = {
                    from: process.env.EMAIL_USER,
                    to: hostEmail,
                    subject: 'Meeting Scheduled',
                    text: `Your meeting is scheduled at ${time} on ${date} so all the best. Join the meeting using https://wemeet-psi.vercel.app/meeting/${meetingId} and your Meeting Id is ${meetingId} and Passwords is wemeet12`
                }

                const user_email_message = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'You Scheduled a Meeting',
                    text: `You scheduled a meeting at ${time} on ${date} so all the best. Join the meeting using https://wemeet-psi.vercel.app/meeting/${meetingId} and your Meeting Id is ${meetingId} and Passwords is wemeet12`
                }
                try {
                    await sendEmail(email_message);
                    await sendEmail(user_email_message);
                    res.json({ success: true, message: "Meeting booked" });
                    await client.expireat('allmeetings:1', 5)
                } catch (emailError) {
                    console.error("Error sending email:", emailError);
                    res.json({ success: false, message: "Error sending email", error: emailError });
                }

            }
            }
        }
        } else {
            res.json({ succes: false, message: "Host email not found" })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router