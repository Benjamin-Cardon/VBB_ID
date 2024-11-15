const express = require('express')
import { Request, Response, Router } from "express";
const login: Router = express.Router()
import client from "../../db/client";

login.post('/attempt', async (req: Request, res: Response) => {
  const { password, username, library } = req.body;
  console.log(username, password, library);
  const result = await client.query('SELECT * FROM id_system.librarians JOIN libraries_library ON librarians.library_id = libraries_library.id WHERE librarians.username = $1 AND librarians.password = $2 AND libraries_library.name = $3', [username, password, library]);
  const user = result.rows[0];
  console.log(user);

  if (!user) {
    res.send("Incorrect Login");
  } else {
    const insert = await client.query('INSERT INTO id_system.librarian_logins (librarian_id, session_id) VALUES ($1, $2)', [user.id, req.sessionID]);
    console.log(insert);
    res.send(req.sessionID);
  }
  console.log("User logged in with this Session ID:", req.sessionID);
})

login.get('/libraries', async (req: Request, res: Response) => {
  let result = await client.query("SELECT id, name, library_code FROM public.libraries_library");
  res.send(JSON.stringify(result.rows));
})

export default login;