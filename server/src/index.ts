import express from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import { rateLimiter } from './middlewares/rateLimit';
import { connectRedis, redisClient } from './redis';

dotenv.config();

void connectRedis();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(rateLimiter);
app.use(express.json());
app.use(
  session({
    store: process.env.REDIS_URL ? new RedisStore({ client: redisClient }) : undefined,
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    proxy: process.env.NODE_ENV === 'production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
