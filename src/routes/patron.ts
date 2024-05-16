const express = require('express')
import { Request, Response, Router } from "express";
import client from "../data/client";
const patron: Router = express.Router()

patron.post('/register', async (req: Request, res: Response) => {
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
    let id = "";
    let id_integer = library.id_integer.toString()
    while (id_integer.length < 5) {
      id_integer = "0" + id_integer;
    }
    id = "ST" + library.name.slice(0, 3).toUpperCase() + new Date().getFullYear().toString().substr(-2) + '-' + id_integer;
    const add_person = await client.query("INSERT INTO patrons(patron_id, library_id, first_name, last_name, gender, date_of_birth, grade_level, immediate_family_members, family_status, family_members_with_income, barriers_to_education, family_support_level, favorite_subject, percieved_most_useful_subject, percieved_most_difficult_subject, library_discovery_method, desired_library_resources, library_attendance_goal ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19", [
      id, library.id,
    ])
  } else {
    res.status(401);
    res.send("Unauthorized Session");
  }

})

async function create_id(library_id: number): Promise<string> {
  let id = "";
  id = "ST" + id;
  let year = new Date().getFullYear().toString().substr(-2)
  id = id + year + '-';

  return id;
}

export default patron;