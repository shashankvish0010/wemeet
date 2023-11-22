import express from 'express';
import pool from '../../dbconnect';
import { v4 as uuidv4 } from 'uuid'
const router = express.Router();

router.post('/create/event/:id', async (req: any, res: any) => {
    const { name, duration, description } = req.body;
    const { id } = req.params;
    try {
        if (!name || !duration || !description) {
            res.json({ succes: false, message: "Fill all the fields" })
        } else {
                const user = await pool.query('SELECT * FROM Users WHERE id=$1', [id])
                console.log(user.rows[0].email);
                
                const email = user.rows[0].email;
                const isExists = await pool.query('SELECT duration FROM Events WHERE user_email=$1', [email]);
                if (isExists.rows.length > 0) {
                    res.json({ succes: false, message: `Event of ${duration} min already exists` })
                } else {
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

module.exports = router