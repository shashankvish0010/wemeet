"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.generateOTP = void 0;
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const actualotp = require("../Controllers/UserControllers");
const OTPgenerator = require('../Services/OtpGenerate');
const sendEmail = require('../Services/Email');
const generateOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { otp } = req.body;
    if (id) {
        const user = yield dbconnect_1.default.query('SELECT * FROM Users WHERE id=$1', [id]);
        console.log(user);
        if (user.rows.length > 0) {
            if (actualotp === otp) {
                const accountVerified = yield dbconnect_1.default.query('UPDATE Users SET account_verified=$1 WHERE id=$2', [true, id]);
                if (accountVerified) {
                    res.json({ success: true, message: "OTP Verified Successfully." });
                }
                else {
                    res.json({ success: false, message: "OTP Verification failed." });
                }
            }
            else {
                res.json({ success: false, message: "Invalid OTP" });
            }
        }
    }
});
exports.generateOTP = generateOTP;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield OTPgenerator();
    const email = yield dbconnect_1.default.query('SELECT email FROM Users WHERE id=$1', [id]);
    const email_message = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Please Verify your Zen Account',
        text: `Your verification code for zen is ${actualotp}`
    };
    const result = yield sendEmail(email_message);
});
exports.resendOTP = resendOTP;
