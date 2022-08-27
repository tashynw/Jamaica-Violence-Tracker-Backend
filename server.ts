const express = require('express');
import {Request, Response} from 'express';
import { updateArticleResults } from './functions/functions'
import mongoose from 'mongoose';
const dotenv = require("dotenv");
const cron = require('node-cron');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();
const PORT: number = 3500;
const databaseEnviroment = process.env.DATABASE_URI || '';

//connect to DB
const connectDB=async()=>{
    try{
        await mongoose.connect(databaseEnviroment);
        console.log('Connected to MongoDB!')
    }catch(err){
        console.error(err);
    }
}
connectDB();

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use('/',cors() ,require('./routes/main'));

app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});

app.listen(process.env.PORT || PORT, () => console.log(`Server running on port ${PORT}`));

cron.schedule('0 */1 * * *', async function() {
    await updateArticleResults()
    console.log(`Articles fetched at ${new Date().toISOString()}`)
});
