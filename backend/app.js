const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const session = require('express-session');
const flash = require('connect-flash');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
require('dotenv').config();

// Import routes
const usersRouter = require('./src/routes/users');
const projectsRouter = require('./src/routes/projects');
const profilesRouter = require('./src/routes/profiles');
const vacanciesRouter = require("./src/routes/vacancies");
const applicationsRouter = require("./src/routes/applications");
const genresRouter = require("./src/routes/genres");
const classesRouter = require("./src/routes/classes");
const rolesRouter = require('./src/routes/roles');
const departmentRouter = require("./src/routes/departments");
const notificationsRouter = require("./src/routes/notifications");
// Initialize Express app
const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());

// Mount other routers here
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'tecnitrama_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/vacancies', vacanciesRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/genres', genresRouter);
app.use('/api/classes', classesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/roles', rolesRouter);
app.use("/api/departments", departmentRouter)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send error response
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;