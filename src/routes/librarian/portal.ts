const express = require('express')
const portal: Router = express.Router()
import { Router, Request, Response } from "express";
import client from "../../db/client";

portal.get('/student_info', async (req: Request, res: Response) => {

})

export default portal;