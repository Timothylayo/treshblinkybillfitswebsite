// ================================================================
// src/app.js
// Express app setup — middleware, routes, error handler.
// Kept separate from index.js so it can be imported in tests.
// ================================================================

import authRouter from './routes/auth.routes.js';
import {requireAuth} from './middleware/auth.middleware.js';
import cookieParser from 'cookie-parser';
import express   from 'express';
import helmet    from 'helmet';
import morgan    from 'morgan';
import path      from 'path';
import { fileURLToPath } from 'url';

import { config }              from './config/app.config.js';
import { corsMiddleware }      from './middleware/cors.middleware.js';
import { responseMiddleware }  from './middleware/response.middleware.js';
import { errorMiddleware }     from './middleware/error.middleware.js';

// Routes
import ordersRouter            from './routes/orders.routes.js';
import designsRouter           from './routes/designs.routes.js';
import productsRouter          from './routes/shared.routes.js';
import {
  categoriesRouter,
  mediaRouter,
  usersRouter,
  invoicesRouter,
}                              from './routes/shared.routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ----------------------------------------------------------------
// GLOBAL MIDDLEWARE
// ----------------------------------------------------------------
app.use(helmet({
  crossOriginResourcePolicy: {policy: "cross-origin"}, // allow images to be served from /uploads
}));               // security headers
app.use(corsMiddleware);         // CORS
app.use(morgan(config.isDev ? 'dev' : 'combined')); // request logging
app.use(express.json());         // parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Attach res.success() / res.fail() to every response
app.use(responseMiddleware);

// Serve uploaded images as static files
// e.g. GET /uploads/some-uuid.jpg
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ----------------------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'TreshBlinkybill Fits API',
    version: '1.0.0',
    env:     config.nodeEnv,
    time:    new Date().toISOString(),
  });
});

// ----------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------
// ---- PUBLIC ROUTES (no auth needed) ----
app.use('/api/auth',       authRouter);
app.use('/api/designs',    designsRouter);
app.use('/api/products',   productsRouter);
app.use('/api/categories', categoriesRouter);

// ---- PROTECTED ROUTES (admin only) ----
app.use('/api/orders',   ordersRouter);
app.use('/api/media',    mediaRouter);
app.use('/api/users',    requireAuth, usersRouter);
app.use('/api/invoices', requireAuth, invoicesRouter);

// ----------------------------------------------------------------
// 404 — route not found
// ----------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route ${req.method} ${req.path} not found`,
  });
});

// ----------------------------------------------------------------
// GLOBAL ERROR HANDLER — must be last
// ----------------------------------------------------------------
app.use(errorMiddleware);

export default app;
