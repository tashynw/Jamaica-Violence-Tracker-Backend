const express = require('express');
import {Request, Response} from 'express';
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT: number = 3500;

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));