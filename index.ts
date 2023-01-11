import express, {Express} from 'express';
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose'
import errorHandler from './middleware/errorHandler'
import customerRouter from './routes/customers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
  console.log(`Database connected @ ${process.pid}`)
}).catch((error) => {
  console.log(error)
})

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json());
app.use(morgan('combined'))
app.use(helmet())

app.use('/customer', customerRouter)

app.use(errorHandler)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
