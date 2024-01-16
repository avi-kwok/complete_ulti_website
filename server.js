// app.mjs

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyparser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './server/database/connection.js'; // Assuming connection.mjs is your ESM module
import router from './server/routes/router.js'; // Assuming router.mjs is your ESM module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config({
  path: 'https://ultideploy.onrender.com'
});
const PORT = 3000;

// log requests
app.use(morgan('tiny'));
app.use(express.json())
// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({
  extended: true
}));

// set view engine
app.set("view engine", "ejs");

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));

// load routers
app.use('/', router);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
