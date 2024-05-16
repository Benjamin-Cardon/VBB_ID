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
const client_1 = __importDefault(require("../data/client"));
const patron = express.Router();
patron.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Recieved Request to Register");
    const { register_form, session_id } = req.body;
    console.log(register_form);
    const result = yield client_1.default.query("SELECT librarian_id FROM librarian_logins WHERE session_id = $1", [session_id]);
    if (result.rows.length > 0) {
        let librarian_id = result.rows[0].librarian_id;
        const librarian = (yield client_1.default.query("SELECT * FROM librarians WHERE id = $1", [librarian_id])).rows[0];
        const library = (yield client_1.default.query("SELECT * FROM libraries WHERE id = $1", [librarian.library_id])).rows[0];
        console.log(register_form);
        console.log(librarian);
        let id = "";
        let id_integer = library.id_integer.toString();
        while (id_integer.length < 5) {
            id_integer = "0" + id_integer;
        }
        id = "ST" + library.name.slice(0, 3).toUpperCase() + new Date().getFullYear().toString().substr(-2) + '-' + id_integer;
        const add_person = yield client_1.default.query("INSERT INTO patrons(patron_id, library_id, first_name, last_name, gender, date_of_birth, grade_level, immediate_family_members, family_status, family_members_with_income, barriers_to_education, family_support_level, favorite_subject, percieved_most_useful_subject, percieved_most_difficult_subject, library_discovery_method, desired_library_resources, library_attendance_goal ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19", [
            id, library.id,
        ]);
    }
    else {
        res.status(401);
        res.send("Unauthorized Session");
    }
}));
function create_id(library_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = "";
        id = "ST" + id;
        let year = new Date().getFullYear().toString().substr(-2);
        id = id + year + '-';
        return id;
    });
}
exports.default = patron;
