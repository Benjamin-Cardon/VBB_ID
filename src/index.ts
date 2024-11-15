import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import attendance from "./routes/librarian/attendance";
import login from "./routes/librarian/login";
import patrons from "./routes/librarian/patrons";
import portal from "./routes/librarian/portal";
import client from './db/client';
const bodyParser = require('body-parser')
var session = require('express-session')
import 'dotenv/config';

client.connect().then(
  () => {
    console.log("connected to postgres")
  }
)

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use(session({
  secret: 'random string to encode with',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());


app.get('/admin', (req: Request, res: Response) => {
  // @ts-ignore
  res.sendFile("C:\\Users\\18016\\Desktop\\Village Libraries\\public\\admin.html");
});

app.get('/data', (req: Request, res: Response) => {
  // @ts-ignore
  res.sendFile("C:\\Users\\18016\\Desktop\\Village Libraries\\public\\data.html");
});

app.get('/librarian', (req: Request, res: Response) => {
  // @ts-ignore
  res.sendFile("C:\\Users\\18016\\Desktop\\Village Libraries\\public\\librarian.html");
});

app.use('/patrons', patrons);
app.use('/login', login);
app.use('/attendance', attendance);
app.use('/portal', portal);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port number: ${port}`);
});