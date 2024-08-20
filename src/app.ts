import express from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app = express();

//parsers

app.use(cookieParser())
app.use(cors());
app.use(express.json());
///application routes

app.use('/api/v1',router)

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use(globalErrorHandler)

app.use(notFound)
export default app;
