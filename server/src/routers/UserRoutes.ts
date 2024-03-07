import express from 'express';
const router = express.Router()
import pool from '../../dbconnect'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
const OTPgenerator = require('../Services/OtpGenerate');

const { sendEmail } = require('../Services/Email');

let actualotp: Number;

router.get('/', (req: any, res: any) => { res.json({ success: true, message: "Hello WeMeet Backe End" }) });

router.post('/user/register', async (req: any, res: any) => {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    try {
        if (!firstname || !lastname || !email || !password || !confirm_password) {
            res.json({ success: false, message: "Fill all the fields" })
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (emailPattern.test(email)) {
                const emailExists = await pool.query('SELECT email from Users WHERE email=$1', [email])
                if (emailExists.rows.length > 0) {
                    res.json({ success: false, message: "Email already regsitered" })
                } else {
                    if (password === confirm_password) {
                        const salt = Number(bcrypt.genSalt(10))
                        const hashedPassword = await bcrypt.hash(password, salt)
                        if (hashedPassword) {
                            const generatedotp = await OTPgenerator();
                            actualotp = generatedotp
                            console.log(actualotp);
                            const email_message = {
                                from: process.env.EMAIL_USER,
                                to: email,
                                subject: 'Please Verify your WeMeet Account',
                                text: `Your verification code for WeMeet is ${actualotp}`
                            }

                            const result = await sendEmail(email_message);

                            if (result == true) {
                                const id = uuidv4();
                                if (id) {
                                    const userRegisteration = await pool.query('INSERT INTO Users(id, firstname, lastname, email, user_password, account_verified) VALUES ($1, $2, $3, $4, $5, $6)', [id, firstname, lastname, email, hashedPassword, false]);
                                    res.json({ success: true, id, message: "User Registered" })
                                }
                            } else {
                                res.json({ success: false, message: "Email not sent" })
                            }
                        }
                    }
                    else {
                        res.json({ success: false, message: "Password does not match" })
                    }
                }
            } else {
                res.json({ success: false, message: "Email pattern is invalid" })
            }
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/otp/verification/:id', async (req: any, res: any) => {
    const { id } = req.params
    const { otp } = req.body
    if (id) {
        const user = await pool.query('SELECT * FROM Users WHERE id=$1', [id])
        console.log(user);
        if (user.rows.length > 0) {
            if (actualotp === otp) {
                const accountVerified = await pool.query('UPDATE Users SET account_verified=$1 WHERE id=$2', [true, id])
                if (accountVerified) {
                    res.json({ success: true, message: "OTP Verified Successfully." })
                } else {
                    res.json({ success: false, message: "OTP Verification failed." })
                }
            } else {
                res.json({ success: false, message: "Invalid OTP" })
            }
        }
    }
})

router.get('/resend/otp/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const resetotp = await OTPgenerator();
    actualotp = resetotp
    const result = await pool.query('SELECT email FROM Users WHERE id=$1', [id])
    console.log(result.rows[0].email);
    const email = result.rows[0].email
    if (result.rows[0].email) {
        const email_message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Please Verify your WeMeet Account',
            text: `Your verification code for WeMeet is ${actualotp}`
        }
        const result = await sendEmail(email_message);
        if (result) {
            res.json({ success: true })
        }
    }
})

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.json({ success: false, message: "Fill both fields" })
    } else {
        const user = await pool.query('SELECT * FROM Users WHERE email=$1', [email])
        if (user.rows.length > 0) {
            if (email === user.rows[0].email) {
                const isMatch = await bcrypt.compare(password, user.rows[0].user_password)
                if (isMatch) {
                    if (user.rows[0].account_verified === false) {
                        res.json({ success: true, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Login Successfully" })
                    } else {
                        const token = jwt.sign(user.rows[0].id, `${process.env.USERS_SECRET_KEY}`)
                        res.json({ success: true, userdata: user.rows[0], id: user.rows[0].id, token, verified: user.rows[0].account_verified, message: "Login Successfully" })

                    }
                } else {
                    res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Incorrect Password" })
                }
            } else {
                res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Email does not exists" })
            }
        }
    }
})


module.exports = router