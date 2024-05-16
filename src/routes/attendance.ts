const express = require('express')
import { Request, Response, Router } from "express";
const attendance: Router = express.Router()
import client from "../data/client";

attendance.post('/event', async (req: Request, res: Response) => {
  const { code, session_id } = req.body;
  // TODO: Adjust this to have some kind of time-out;
  const result = await client.query("SELECT * FROM librarian_logins WHERE session_id = $1", [session_id])
  if (result.rows.length > 0) {
    const check_code = await client.query("SELECT patron_id, library_id FROM patrons WHERE patron_id = $1", [code]);
    if (check_code.rowCount == 0) {
      res.send("No such code.")
    } else {
      // TODO manage timezones.
      const prev_login = await client.query("SELECT * FROM attendance_log WHERE patron_id = $1 AND DATE(time_attended) = CURRENT_DATE", [code])
      if (prev_login.rows.length == 0) {
        const insert_login = await client.query("INSERT INTO attendance_log (patron_id, library_id) VALUES($1, $2)", [code, check_code.rows[0].library_id])

        res.send("Patron Logged in")
      } else if (prev_login.rows.length > 0) {

        res.send("This person is already logged in for today!")
      } else {
        // some kind of error
        console.log("We shouldn't have gotten here")
        res.status(400);
        res.send("Something went wrong");
      }
    }
  } else {
    res.status(401);
    res.send("Unauthorized Session");
  }
  console.log("User logged in with code:", code, `\n and with the session Id:`, session_id);
})

export default attendance;