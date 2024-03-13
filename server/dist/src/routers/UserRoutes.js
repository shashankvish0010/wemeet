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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dbconnect_1 = __importDefault(require("../../dbconnect"));
// import bcrypt from 'bcrypt'
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = require('../Services/redis');
const OTPgenerator = require('../Services/OtpGenerate');
const { sendEmail } = require('../Services/Email');
let actualotp;
router.get('/', (req, res) => { res.json({ success: true, message: "Hello WeMeet Backe End" }); });
router.post('/user/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    try {
        if (!firstname || !lastname || !email || !password || !confirm_password) {
            res.json({ success: false, message: "Fill all the fields" });
        }
        else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailPattern.test(email)) {
                const emailExists = yield dbconnect_1.default.query('SELECT email from Users WHERE email=$1', [email]);
                if (emailExists.rows.length > 0) {
                    res.json({ success: false, message: "Email already regsitered" });
                }
                else {
                    if (password === confirm_password) {
                        // const salt = Number(bcrypt.genSalt(10))
                        // const hashedPassword = await bcrypt.hash(password, salt)
                        if (password) {
                            const generatedotp = yield OTPgenerator();
                            actualotp = generatedotp;
                            console.log(actualotp);
                            const email_message = {
                                from: process.env.EMAIL_USER,
                                to: email,
                                subject: 'Please Verify your WeMeet Account',
                                text: `Your verification code for WeMeet is ${actualotp}`
                            };
                            const result = yield sendEmail(email_message);
                            if (result == true) {
                                const id = (0, uuid_1.v4)();
                                if (id) {
                                    const userRegisteration = yield dbconnect_1.default.query('INSERT INTO Users(id, firstname, lastname, email, user_password, account_verified) VALUES ($1, $2, $3, $4, $5, $6)', [id, firstname, lastname, email, password, false]);
                                    res.json({ success: true, id, message: "User Registered" });
                                }
                            }
                            else {
                                res.json({ success: false, message: "Email not sent" });
                            }
                        }
                    }
                    else {
                        res.json({ success: false, message: "Password does not match" });
                    }
                }
            }
            else {
                res.json({ success: false, message: "Email pattern is invalid" });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/otp/verification/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.get('/resend/otp/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const resetotp = yield OTPgenerator();
    actualotp = resetotp;
    const result = yield dbconnect_1.default.query('SELECT email FROM Users WHERE id=$1', [id]);
    console.log(result.rows[0].email);
    const email = result.rows[0].email;
    if (result.rows[0].email) {
        const email_message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Please Verify your WeMeet Account',
            text: `Your verification code for WeMeet is ${actualotp}`
        };
        const result = yield sendEmail(email_message);
        if (result) {
            res.json({ success: true });
        }
    }
}));
router.post('/user/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ success: false, message: "Fill both fields" });
    }
    else {
        const user = yield dbconnect_1.default.query('SELECT * FROM Users WHERE email=$1', [email]);
        if (user.rows.length > 0) {
            // const isMatch = await bcrypt.compare(password, user.rows[0].user_password)
            if (password == user.rows[0].user_password) {
                if (user.rows[0].account_verified === false) {
                    res.json({ success: true, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Login Successfully" });
                }
                else {
                    const token = jsonwebtoken_1.default.sign(user.rows[0].id, `${process.env.USERS_SECRET_KEY}`);
                    yield client.expireat('allmeetings:1', 5);
                    res.json({ success: true, userdata: user.rows[0], id: user.rows[0].id, token, verified: user.rows[0].account_verified, message: "Login Successfully" });
                }
            }
            else {
                res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Incorrect Password" });
            }
        }
        else {
            res.json({ success: false, message: "Email does not exists" });
        }
    }
}));
module.exports = router;
