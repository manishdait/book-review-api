import express from 'express';
import mongoose from 'mongoose';

import userRouter from './router/userRouter';
import bookRouter from './router/bookRouter';
import reviewRouter from './router/reviewRouter';
import { Config } from './config/config';

const app = express();

app.use(express.json());

app.use('/api/v1/', userRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/reviews', reviewRouter);

const start = async () => {
  await mongoose.connect(Config.DB_URL);

  app.listen(Config.PORT, () => {
    console.log(`Server is listening on port ${Config.PORT}`);
  });
}

start();
