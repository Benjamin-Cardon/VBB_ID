"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const login_1 = __importDefault(require("./routes/login"));
const patron_1 = __importDefault(require("./routes/patron"));
const portal_1 = __importDefault(require("./routes/portal"));
const client_1 = __importDefault(require("./data/client"));
var session = require('express-session');
dotenv_1.default.config();
client_1.default.connect().then(() => {
    console.log("connected to postgres");
});
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(session({
    secret: 'random string to encode with',
    resave: false,
    saveUninitialized: false
}));
app.get("/", (req, res, next) => {
    try {
        res.send("index.html");
    }
    catch (error) {
        next(error);
    }
});
app.use('/patron', patron_1.default);
app.use('/login', login_1.default);
app.use('/attendance', attendance_1.default);
app.use('/portal', portal_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port number: ${port}`);
});
