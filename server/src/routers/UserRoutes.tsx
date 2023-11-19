import express from 'express';
const router = express.Router()

import { userRegistration } from '../Controllers/UserControllers';

router.post('/user/regitser', (req: any,res: any) => userRegistration(req, res))

module.exports = router