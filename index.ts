import express, {Express} from 'express';
// const cors = require('cors')
// const morgan = require('morgan')
// const helmet = require('helmet')
// const xss = require('xss-clean')
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const mongoose = require('mongoose')
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


// app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json());
// app.use(morgan('combined'))
// app.use(helmet())
// app.use(xss())

app.use('/api/customers', require('./routes/customers'))


app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
