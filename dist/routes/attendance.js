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
const express = require('express');
const attendance = express.Router();
const client_1 = __importDefault(require("../data/client"));
attendance.post('/event', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, session_id } = req.body;
    // TODO: Adjust this to have some kind of time-out;
    const result = yield client_1.default.query("SELECT * FROM librarian_logins WHERE session_id = $1", [session_id]);
    if (result.rows.length > 0) {
        const check_code = yield client_1.default.query("SELECT patron_id, library_id FROM patrons WHERE patron_id = $1", [code]);
        if (check_code.rowCount == 0) {
            res.send("No such code.");
        }
        else {
            // TODO manage timezones.
            const prev_login = yield client_1.default.query("SELECT * FROM attendance_log WHERE patron_id = $1 AND DATE(time_attended) = CURRENT_DATE", [code]);
            if (prev_login.rows.length == 0) {
                const insert_login = yield client_1.default.query("INSERT INTO attendance_log (patron_id, library_id) VALUES($1, $2)", [code, check_code.rows[0].library_id]);
                res.send("Patron Logged in");
            }
            else if (prev_login.rows.length > 0) {
                res.send("This person is already logged in for today!");
            }
            else {
                // some kind of error
                console.log("We shouldn't have gotten here");
                res.status(400);
                res.send("Something went wrong");
            }
        }
    }
    else {
        res.status(401);
        res.send("Unauthorized Session");
    }
    console.log("User logged in with code:", code, `\n and with the session Id:`, session_id);
}));
exports.default = attendance;
