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
const client_1 = __importDefault(require("../../db/client"));
const dayjs_1 = __importDefault(require("dayjs"));
const patrons = express.Router();
patrons.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        console.log(library);
        let id = create_id(library.id_count);
        console.log(register_form.desired_library_resources);
        const add_person = yield client_1.default.query("INSERT INTO patrons(patron_id, library_id, first_name, last_name, gender, date_of_birth, grade_level, immediate_family_members, family_status, family_members_with_income, barriers_to_education, family_support_level, favorite_subject, percieved_most_useful_subject, percieved_most_difficult_subject, library_discovery_method,library_travel_time, desired_library_resources, library_attendance_goal ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)", [
            id, library.id, register_form.first_name, register_form.last_name, register_form.gender, register_form.date_of_birth, register_form.grade_level, register_form.family_members, register_form.family_status, register_form.family_members_with_income, register_form.barriers_to_education, register_form.family_support_level, register_form.favorite_subject, register_form.percieved_most_useful_subject, register_form.percieved_most_difficult_subject, register_form.library_discovery_method, register_form.library_travel_time, register_form.desired_library_resource, register_form.library_attendance_goal
        ]);
        console.log("Added Person");
        const update_count = yield client_1.default.query('UPDATE libraries SET id_count = $1 WHERE id = $2', [library.id_count + 1, library.id]);
        console.log("Count Updated;");
        res.status(200);
        res.send(id);
        //create_id(library);
    }
    else {
        res.status(401);
        res.send("Unauthorized Session");
    }
}));
patrons.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let session_id = req.query.session;
    console.log("Recieved Request for List:", session_id);
    const login_entry = yield client_1.default.query("SELECT * FROM librarian_logins WHERE session_id = $1", [session_id]);
    let librarian_id, library_id;
    if (login_entry.rows.length == 0) {
        res.send("No such session");
        res.status(400);
    }
    else {
        librarian_id = login_entry.rows[0].librarian_id;
    }
    console.log("Librarian ID", librarian_id);
    const librarian_entry = yield client_1.default.query("SELECT * FROM librarians WHERE id = $1", [librarian_id]);
    if (librarian_entry.rows.length == 0) {
        res.send("Internal Database Error: Mismatch of librarian ID's ");
        res.status(400);
    }
    else {
        library_id = librarian_entry.rows[0].library_id;
    }
    let query_string = `
    SELECT
      patrons.*,
      COALESCE(attendance_counts.attendance_count, 0) AS attendance_count,
      attendance_counts.most_recent_attendance
    FROM
      public.patrons
    LEFT JOIN (
      SELECT
          attendance_log.patron_id,
          COUNT(attendance_log.id) AS attendance_count,
          MAX(attendance_log.time_attended) AS most_recent_attendance
      FROM
          attendance_log
      GROUP BY
          attendance_log.patron_id
    ) AS attendance_counts
    ON
      patrons.patron_id = attendance_counts.patron_id
    JOIN
      public.libraries
    ON
      patrons.library_id = libraries.id
    WHERE
      libraries.id = $1 -- Replace with the specific library ID you want to filter by
    ORDER BY
      first_name ASC;`;
    const patron_list = yield client_1.default.query(query_string, [library_id]);
    //console.log(patron_list.rows)
    const cleaned_patron_list = patron_list.rows.map((sql_patron) => {
        return {
            patron_id: sql_patron.patron_id,
            last_login: sql_patron.most_recent_attendance ? (0, dayjs_1.default)(sql_patron.most_recent_attendance) : null,
            count_logins: sql_patron.attendance_count,
            profile: {
                first_name: sql_patron.first_name,
                last_name: sql_patron.last_name,
                gender: sql_patron.gender,
                date: sql_patron.date_of_birth ? (0, dayjs_1.default)(sql_patron.date_of_birth) : null,
                grade_level: sql_patron.grade_level,
                family_members: sql_patron.immediate_family_members,
                family_status: sql_patron.family_status,
                family_members_with_income: sql_patron.family_members_with_income,
                barriers_to_education: sql_patron.barriers_to_education,
                family_support_level: sql_patron.family_support_level,
                favorite_subject: sql_patron.favorite_subject,
                percieved_most_useful_subject: sql_patron.percieved_most_useful_subject,
                percieved_most_difficult_subject: sql_patron.percieved_most_difficult_subject,
                library_discovery_method: sql_patron.library_discovery_method,
                library_travel_time: sql_patron.library_travel_time,
                desired_library_resource: sql_patron.desired_library_resources,
                library_attendance_goal: sql_patron.library_attendance_goal,
            }
        };
    });
    console.log(cleaned_patron_list);
    res.status(200);
    res.send(JSON.stringify(cleaned_patron_list));
}));
function create_id(library_id) {
    let id = "";
    id = "ST" + id;
    let year = new Date().getFullYear().toString().substr(-2);
    id = id + year + '-';
    let id_integer = library_id.toString();
    while (id_integer.length < 5) {
        id_integer = "0" + id_integer;
    }
    id = id + id_integer;
    return id;
}
exports.default = patrons;
