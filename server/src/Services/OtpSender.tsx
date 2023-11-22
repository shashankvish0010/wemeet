import express from "express";
import pool from '../../dbconnect'
const actualotp = require("../Controllers/UserControllers")

export const generateOTP = async (req: any, res: any) => {
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
}

export const resendOTP = async (req: any, res: any) => {
    
}