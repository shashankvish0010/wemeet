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
exports.userRegistration = exports.actualotp = void 0;
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const OtpGenerate_1 = __importDefault(require("../Services/OtpGenerate"));
const sendEmail = require('../Services/Email');
const userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                        const salt = Number(bcrypt_1.default.genSalt(10));
                        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                        if (hashedPassword) {
                            yield (0, OtpGenerate_1.default)();
                            console.log(exports.actualotp);
                            const email_message = {
                                from: process.env.EMAIL_USER,
                                to: email,
                                subject: 'Please Verify your Zen Account',
                                text: `Your verification code for zen is ${exports.actualotp}`
                            };
                            const result = yield sendEmail(email_message);
                            if (result == true) {
                                const id = (0, uuid_1.v4)();
                                if (id) {
                                    const userRegisteration = yield dbconnect_1.default.query('INSERT INTO Users(id, firstname, lastname, email, user_password, account_verified) VALUES ($1, $2, $3, $4, $5, $6)', [id, firstname, lastname, email, password, false]);
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
});
exports.userRegistration = userRegistration;
