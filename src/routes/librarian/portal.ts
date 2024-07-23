const express = require('express')
const portal: Router = express.Router()
import { Router, Request, Response } from "express";
import client, { mentorship } from "../../db/client";
mentorship.connect()
  .then(() => {
    console.log("Connected to Mentorship")
  })

portal.get('/student_info', async (req: Request, res: Response) => {
  const { session_id } = req.query;
  const session_result = await client.query("SELECT librarian_id FROM librarian_logins WHERE session_id = $1", [session_id])
  if (session_result.rows.length != 1) {
    res.status(401);
    res.send("Unauthorized Session");
  } else {
    // if the session has been validated...
    // We want to get the correct library id.
    const mentorship_library_result = await client.query("SELECT libraries.mentorship_library_id, libraries.id FROM libraries JOIN librarians ON libraries.id = librarians.library_id WHERE librarians.id = $1", [session_result.rows[0].librarian_id])
    const query_patrons = ` SELECT mentorship_user_id FROM patrons WHERE library_id = $1 AND mentorship_user_id IS NOT NULL`;
    const query_mentorship = `SELECT * FROM users_user JOIN profiles_studentprofile ON users_user.id =profiles_studentprofile.user_id WHERE users_user.is_student = true AND profiles_studentprofile.assigned_library_id=$1`;
    const affiliated_patrons_result = await client.query(query_patrons, [mentorship_library_result.rows[0].id])
    //console.log("Ids which have already been affiliated", affiliated_patrons_result)
    const mentorship_patrons_result = await mentorship.query(query_mentorship, [mentorship_library_result.rows[0].mentorship_library_id])
    //console.log("This is the mentorship patrons result:", mentorship_patrons_result.rows)
    let mentorship_patrons = mentorship_patrons_result.rows;
    for (let patron of mentorship_patrons) {
      if (affiliated_patrons_result.rows.some((affiliated_patron) => affiliated_patron.mentorship_user_id == patron.user_id)) {
        patron.affiliated = true;
        console.log("This patron is already affiliated:", patron)
      } else {
        patron.affiliated = false;
        console.log("This patron is not already affiliated:", patron)
      }
    }
    res.send(JSON.stringify(mentorship_patrons));
  }
})

export default portal;