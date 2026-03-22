import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './v1/config/env';
import routes from './v1/routes';
import { errorMiddleware } from './v1/middlewares/error.middleware';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(helmet());
app.set('trust proxy', 1);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Health check
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'TenderVault API is running.' });
});

// Versioned routes
app.use('/v1', routes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
