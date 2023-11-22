import pool from '../../dbconnect'
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

const sendEmail = require('../Services/Email');

let actualotp: Number;
export const userRegistration = async (req: any, res: any) => {
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
                            const generatedOtp = Number(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`)
                            actualotp = generatedOtp

                            const email_message = {
                                from: process.env.EMAIL_USER,
                                to: email,
                                subject: 'Please Verify your Zen Account',
                                text: `Your verification code for zen is ${actualotp}`
                            }

                            const result = await sendEmail(email_message);

                            if(result == true){
                                const id = uuidv4();
                                if(id){
                                    const userRegisteration = await pool.query('INSERT INTO Users(id, firstname, lastname, email, user_password, account_verified) VALUES ($1, $2, $3, $4, $5, $6)', [id, firstname, lastname, email, password, false])
                                }
                            }else{
                                res.json({ success: false, message: "Email not sent" })
                            }
                        }
                    }
                    else{
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
}
