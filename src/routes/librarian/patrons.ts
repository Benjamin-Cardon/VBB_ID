const express = require('express')
import { Request, Response, Router } from "express";
import client from "../../db/client";
import type { patron } from "../../../client/types.d.ts"
import dayjs, { Dayjs } from "dayjs";
const patrons: Router = express.Router()

patrons.post('/register', async (req: Request, res: Response) => {
  console.log("Recieved Request to Register")
  const { register_form, session_id } = req.body;
  console.log(register_form);
  const result = await client.query("SELECT librarian_id FROM id_system.librarian_logins WHERE session_id = $1", [session_id])

  if (result.rows.length == 0) {
    res.status(401);
    res.send("Unauthorized Session");
  }

  const librarian_id = result.rows[0].librarian_id;
  const librarian = (await client.query("SELECT * FROM id_system.librarians WHERE id = $1", [librarian_id])).rows[0];
  const library = (await client.query("SELECT * FROM libraries_library WHERE id = $1", [librarian.library_id])).rows[0];
  const count_exists = (await client.query("SELECT COUNT(*) from id_system.library_patron_count_incrementer WHERE library_id = $1", [librarian.library_id])).rows[0].count > 0;

  if (!count_exists) {
    await client.query("INSERT INTO id_system.library_patron_count_incrementer VALUES ($1 , 0)", [librarian.library_id])
  }

  const incremented_count = count_exists ? Number((await client.query("SELECT * from id_system.library_patron_count_incrementer WHERE library_id = $1", [librarian.library_id])).rows[0].patron_count_incrementer) + 1 : 1;
  const id = create_id(incremented_count, register_form.student == "Student");
  await client.query("INSERT INTO id_system.patrons(patron_id, library_id, first_name, last_name, gender, date_of_birth, grade_level, immediate_family_members, family_status, family_members_with_income, barriers_to_education, family_support_level, favorite_subject, percieved_most_useful_subject, percieved_most_difficult_subject, library_discovery_method,library_travel_time, desired_library_resources, library_attendance_goal, is_student, user_id ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,$21)", [
    id, library.id, register_form.first_name, register_form.last_name, register_form.gender, register_form.date, register_form.grade_level, register_form.family_members, register_form.family_status, register_form.family_members_with_income, register_form.barriers_to_education, register_form.family_support_level, register_form.favorite_subject, register_form.percieved_most_useful_subject, register_form.percieved_most_difficult_subject, register_form.library_discovery_method, register_form.library_travel_time, register_form.desired_library_resources, register_form.goals, register_form.student == "Student", register_form.mentorship_user_id
  ])
  await client.query('UPDATE id_system.library_patron_count_incrementer SET patron_count_incrementer = $1 WHERE library_id = $2', [incremented_count, library.id]);

  res.status(200);
  res.send(id);
  //create_id(library);

})

patrons.post('/update_info', async (req: Request, res: Response) => {
  console.log("Recieved Request to change patron info")
  const { modified_patron_profile, session_id } = req.body;
  console.log(modified_patron_profile)
  const result = await client.query("SELECT librarian_id FROM id_system.librarian_logins WHERE session_id = $1", [session_id])
  if (result.rows.length > 0) {
    const query_string = `UPDATE public.patrons
    SET
    first_name = $1,
    last_name = $2,
    immediate_family_members = $3,
    family_status = $4,
    family_members_with_income = $5,
    barriers_to_education = $6,
    family_support_level = $7,
    favorite_subject = $8,
    percieved_most_useful_subject = $9,
    percieved_most_difficult_subject = $10,
    library_discovery_method = $11,
    library_travel_time = $12,
    desired_library_resources = $13,
    library_attendance_goal = $14,
    mentorship_user_id = $16
    WHERE
    patron_id = $15;
    `
    const update_result = await client.query(query_string, [
      modified_patron_profile.profile.first_name,
      modified_patron_profile.profile.last_name,
      modified_patron_profile.profile.family_members,
      modified_patron_profile.profile.family_status,
      modified_patron_profile.profile.family_members_with_income,
      modified_patron_profile.profile.barriers_to_education,
      modified_patron_profile.profile.family_support_level,
      modified_patron_profile.profile.favorite_subject,
      modified_patron_profile.profile.percieved_most_useful_subject,
      modified_patron_profile.profile.percieved_most_difficult_subject,
      modified_patron_profile.profile.library_discovery_method,
      modified_patron_profile.profile.library_travel_time,
      modified_patron_profile.profile.desired_library_resource,
      modified_patron_profile.profile.library_attendance_goal,
      modified_patron_profile.patron_id,
      modified_patron_profile.profile.mentorship_user_id == 0 ? null : modified_patron_profile.profile.mentorship_user_id
    ])
    console.log(update_result)
    res.status(200);
    res.send("Update Successful");
    //create_id(library);
  } else {
    res.status(401);
    res.send("Unauthorized Session");
  }
})

patrons.get('/list', async (req: Request, res: Response) => {
  let session_id = req.query.session;
  console.log("Recieved Request for List:", session_id)
  const login_entry = await client.query("SELECT * FROM id_system.librarian_logins WHERE session_id = $1", [session_id])
  let librarian_id, library_id;
  if (login_entry.rows.length == 0) {
    res.send("No such session");
    res.status(400);
  } else {
    librarian_id = login_entry.rows[0].librarian_id;
  }
  console.log("Librarian ID", librarian_id)
  const librarian_entry = await client.query("SELECT * FROM id_system.librarians WHERE id = $1", [librarian_id])
  if (librarian_entry.rows.length == 0) {
    res.send("Internal Database Error: Mismatch of librarian ID's ");
    res.status(400);
  } else {
    library_id = librarian_entry.rows[0].library_id;
  }
  let query_string = `
    SELECT
      id_system.patrons.*,
      COALESCE(attendance_counts.attendance_count, 0) AS attendance_count,
      attendance_counts.most_recent_attendance
    FROM
      id_system.patrons
    LEFT JOIN (
      SELECT
          id_system.attendance_log.patron_id,
          COUNT(id_system.attendance_log.id) AS attendance_count,
          MAX(id_system.attendance_log.time_attended) AS most_recent_attendance
      FROM
          id_system.attendance_log
      GROUP BY
          id_system.attendance_log.patron_id
    ) AS attendance_counts
    ON
      id_system.patrons.patron_id = attendance_counts.patron_id
    JOIN
      libraries_library
    ON
      id_system.patrons.library_id = libraries_library.id
    WHERE
      libraries_library.id = $1 -- Replace with the specific library ID you want to filter by
    ORDER BY
      first_name ASC;`
  const patron_list = await client.query(query_string, [library_id])
  //console.log(patron_list.rows)
  const cleaned_patron_list = patron_list.rows.map((sql_patron): patron => {
    return {
      patron_id: sql_patron.patron_id,
      last_login: sql_patron.most_recent_attendance ? sql_patron.most_recent_attendance : null,
      count_logins: sql_patron.attendance_count,
      profile: {
        first_name: sql_patron.first_name,
        last_name: sql_patron.last_name,
        gender: sql_patron.gender,
        date: sql_patron.date_of_birth ? sql_patron.date_of_birth : null,
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
        mentorship_user_id: sql_patron.mentorship_user_id
      }
    }
  })
  console.log(cleaned_patron_list)
  res.status(200)
  res.send(JSON.stringify(cleaned_patron_list));
})

function create_id(library_id: number, is_student: boolean): string {
  let id = "";
  id = is_student ? "ST" + id : "NS" + id;
  let year = new Date().getFullYear().toString().substr(-2)
  id = id + year + '-';
  let id_integer = library_id.toString();
  while (id_integer.length < 5) {
    id_integer = "0" + id_integer;
  }
  id = id + id_integer;
  return id;
}

export default patrons;