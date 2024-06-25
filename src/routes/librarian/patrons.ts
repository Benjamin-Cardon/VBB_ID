const express = require('express')
import { Request, Response, Router } from "express";
import client from "../../db/client";
import patron from "../../../client/types"
const patrons: Router = express.Router()

patrons.post('/register', async (req: Request, res: Response) => {
  console.log("Recieved Request to Register")
  const { register_form, session_id } = req.body;
  console.log(register_form);
  const result = await client.query("SELECT librarian_id FROM librarian_logins WHERE session_id = $1", [session_id])
  if (result.rows.length > 0) {
    let librarian_id = result.rows[0].librarian_id;
    const librarian = (await client.query("SELECT * FROM librarians WHERE id = $1", [librarian_id])).rows[0];
    const library = (await client.query("SELECT * FROM libraries WHERE id = $1", [librarian.library_id])).rows[0];
    console.log(register_form);
    console.log(librarian)
    console.log(library);
    let id = create_id(library.id_count);
    console.log(register_form.desired_library_resources)
    const add_person = await client.query("INSERT INTO patrons(patron_id, library_id, first_name, last_name, gender, date_of_birth, grade_level, immediate_family_members, family_status, family_members_with_income, barriers_to_education, family_support_level, favorite_subject, percieved_most_useful_subject, percieved_most_difficult_subject, library_discovery_method,library_travel_time, desired_library_resources, library_attendance_goal ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)", [
      id, library.id, register_form.first_name, register_form.last_name, register_form.gender, register_form.date_of_birth, register_form.grade_level, register_form.family_members, register_form.family_status, register_form.family_members_with_income, register_form.barriers_to_education, register_form.family_support_level, register_form.favorite_subject, register_form.percieved_most_useful_subject, register_form.percieved_most_difficult_subject, register_form.library_discovery_method, register_form.library_travel_time, register_form.desired_library_resource, register_form.library_attendance_goal
    ])
    console.log("Added Person");
    const update_count = await client.query('UPDATE libraries SET id_count = $1 WHERE id = $2', [library.id_count + 1, library.id]);
    console.log("Count Updated;")
    res.status(200);
    res.send(id);
    //create_id(library);
  } else {
    res.status(401);
    res.send("Unauthorized Session");
  }
})

patrons.get('/list', async (req: Request, res: Response) => {
  let session_id = req.query.session;
  console.log("Recieved Request for List:", session_id)
  const result = await client.query("SELECT * FROM librarian_logins WHERE session_id = $1", [session_id])
  if (result.rows.length == 0) {
    res.send("No such session");
    res.status(400);
  }
  //TODO, add session Checking

  res.send("You will have troubles until this is an array of patron objects.")
})

function create_id(library_id: number): string {
  let id = "";
  id = "ST" + id;
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