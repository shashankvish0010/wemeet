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
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.post('/create/event/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, duration, description } = req.body;
    const { id } = req.params;
    try {
        if (!name || !duration || !description) {
            res.json({ succes: false, message: "Fill all the fields" });
        }
        else {
            const user = yield dbconnect_1.default.query('SELECT * FROM Users WHERE id=$1', [id]);
            console.log(user.rows[0].email);
            const email = user.rows[0].email;
            const isExists = yield dbconnect_1.default.query('SELECT duration FROM Events WHERE user_email=$1', [email]);
            if (isExists.rows.length > 0) {
                res.json({ succes: false, message: `Event of ${duration} min already exists` });
            }
            else {
                const id = (0, uuid_1.v4)();
                const newEvent = yield dbconnect_1.default.query('INSERT INTO Events(id, event_name, duration, event_description, user_email, active) VALUES($1, $2, $3, $4, $5, $6)', [id, name, duration, description, email, true]);
                if (newEvent) {
                    res.json({ succes: true, message: "Event Created" });
                }
                else {
                    res.json({ succes: false, message: "Event not created" });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
