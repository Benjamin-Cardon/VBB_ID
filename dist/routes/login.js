"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const login = express.Router();
const client_1 = __importDefault(require("../data/client"));
login.post('/attempt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const result = yield client_1.default.query('SELECT * FROM librarians WHERE username = $1 AND password = $2', [username, password]);
    const user = result.rows[0];
    console.log(user);
}));
login.get('/libraries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield client_1.default.query("SELECT * FROM public.libraries");
    res.send(JSON.stringify(result.rows));
}));
exports.default = login;
