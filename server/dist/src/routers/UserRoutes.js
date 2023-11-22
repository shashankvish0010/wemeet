"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userRegistration = require('../Controllers/UserControllers');
const { generateOTP } = require('../Services/OtpSender');
router.post('/user/regitser', (req, res) => { userRegistration(req, res); });
router.post('/otp/verification/:id', (req, res) => { generateOTP(req, res); });
exports.default = router;
