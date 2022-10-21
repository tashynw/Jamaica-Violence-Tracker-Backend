"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const functions_1 = require("./functions/functions");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = require("dotenv");
const cron = require('node-cron');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();
const PORT = 3500;
const databaseEnviroment = process.env.DATABASE_URI || '';
//connect to DB
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(databaseEnviroment);
        console.log('Connected to MongoDB!');
    }
    catch (err) {
        console.error(err);
    }
};
connectDB();
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json 
app.use(express.json());
//middleware for cookies
app.use(cookieParser());
app.use('/', cors(), require('./routes/main'));
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    }
    else {
        res.type('txt').send("404 Not Found");
    }
});
app.listen(process.env.PORT || PORT, () => console.log(`Server running on port ${PORT}`));
cron.schedule('0 */2 * * *', async function () {
    await (0, functions_1.updateArticleResults)();
    console.log(`Articles fetched at ${new Date().toISOString()}`);
});
//# sourceMappingURL=server.js.map