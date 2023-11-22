import express from 'express';
const router = express.Router()
const userRegistration = require('../Controllers/UserControllers')
const {generateOTP} = require('../Services/OtpSender')

router.post('/user/regitser', (req: any,res: any) => { userRegistration(req, res) })
router.post('/otp/verification/:id', (req: any,res: any) => { generateOTP(req, res) })

export default router