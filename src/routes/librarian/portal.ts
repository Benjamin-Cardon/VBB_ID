const express = require('express')
const portal: Router = express.Router()
import { Router, Request, Response } from "express";
import client, { mentorship } from "../../db/client";

portal.get('/student_info', async (req: Request, res: Response) => {
  const { session_id } = req.query;
  console.log(req)
  const session_result = await client.query("SELECT librarian_id FROM librarian_logins WHERE session_id = $1", [session_id])
  if (session_result.rows.length != 1) {
    res.status(401);
    res.send("Unauthorized Session");
  } else {
    // if the session has been validated...
    // We want to get the correct library id.
    const mentorship_library_result = await client.query("SELECT libraries.mentorship_library_id, libraries.id FROM libraries JOIN librarians ON libraries.id = librarians.library_id WHERE librarians.id = $1", [session_result.rows[0].librarian_id])
    console.log("This is the mentorship query result", mentorship_library_result);
    const query_patrons = ` SELECT mentorship_user_id FROM patrons WHERE library_id = $1 AND mentorship_user_id IS NOT NULL`;
    const query_mentorship = `SELECT * FROM users_user JOIN profiles_studentprofile ON users_user.id =profiles_studentprofile.user_id WHERE users_user.is_student = true AND profiles_studentprofile.assigned_library_id=$1`;
    const affiliated_patrons_result = await client.query(query_patrons, [mentorship_library_result.rows[0].id])
    console.log("Ids which have already been affiliated", affiliated_patrons_result)

    mentorship.connect()
      .then(() => {
        console.log("Connected to Mentorship")
      })

    const mentorship_patrons_result = await mentorship.query(query_mentorship, [mentorship_library_result.rows[0].mentorship_library_id])
    console.log("This is the mentorship patrons result:", mentorship_patrons_result.rows)
  }

})

export default portal;