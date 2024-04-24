import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";


dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send("index.html");
  } catch (error) {
    next(error);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port number: ${port}`);
});