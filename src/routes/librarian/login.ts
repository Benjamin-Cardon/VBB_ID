const express = require('express')
import { Request, Response, Router } from "express";
const login: Router = express.Router()
import client from "../../db/client";

login.post('/attempt', async (req: Request, res: Response) => {
  const { password, username, library } = req.body;
  console.log(username, password, library);
  const result = await client.query('SELECT * FROM librarians WHERE username = $1 AND password = $2', [username, password]);
  const user = result.rows[0];
  //console.log(user);

  if (!user) {
    res.send("Incorrect Login");
  } else {
    const insert = await client.query('INSERT INTO librarian_logins (librarian_id, session_id) VALUES ($1, $2)', [user.id, req.sessionID]);
    console.log(insert);
    res.send(req.sessionID);
  }
  console.log("User logged in with this Session ID:", req.sessionID);
})

login.get('/libraries', async (req: Request, res: Response) => {
  let result = await client.query("SELECT * FROM public.libraries");
  res.send(JSON.stringify(result.rows));
})

export default login;