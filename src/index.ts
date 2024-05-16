import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import attendance from "./routes/attendance";
import login from "./routes/login";
import patron from "./routes/patron";
import portal from "./routes/portal";
import client from './data/client';
const bodyParser = require('body-parser')
var session = require('express-session')

dotenv.config();

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

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send("index.html");
  } catch (error) {
    next(error);
  }
});

app.use('/patron', patron);
app.use('/login', login);
app.use('/attendance', attendance);
app.use('/portal', portal);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port number: ${port}`);
});