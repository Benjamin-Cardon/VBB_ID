const express = require('express')
const portal: Router = express.Router()
import { Router, Request, Response } from "express";
import client from "../../db/client";

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
    const mentorship_library_result = await client.query("SELECT mentorship_library_id FROM libraries JOIN librarians ON libraries.id = librarians.library_id WHERE librarians.id = $1", [session_result.rows[0].librarian_id])
    console.log("This is the mentorship query result", mentorship_library_result);
  }

})

export default portal;