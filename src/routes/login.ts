const express = require('express')
import { Request, Response, Router } from "express";
const login: Router = express.Router()
import client from "../data/client";

login.post('/attempt', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await client.query('SELECT * FROM librarians WHERE username = $1 AND password = $2', [username, password]);
  const user = result.rows[0];
  console.log(user);
})

login.get('/libraries', async (req: Request, res: Response) => {
  let result = await client.query("SELECT * FROM public.libraries");
  res.send(JSON.stringify(result.rows));
})

export default login;