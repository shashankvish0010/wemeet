import express from 'express';
const router = express.Router()
const userRegistration = require('../Controllers/UserControllers')

router.post('/user/regitser', (req: any,res: any) => userRegistration(req, res))

export default router