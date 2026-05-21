const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const authControllers = require('./controllers/authControllers');
const classControllers = require('./controllers/classControllers');
const attendanceControllers = require('./controllers/attendanceControllers');

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(cookieSession({ name: 'session', secret: process.env.SESSION_SECRET }));
app.use(express.json());

// Serve built React frontend in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ====================================
// Auth routes
// ====================================

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Class routes (all require authentication)
// ====================================

app.get('/api/classes', checkAuthentication, classControllers.listClasses);
app.post('/api/classes', checkAuthentication, classControllers.createClass);
app.patch('/api/classes/:class_id', checkAuthentication, classControllers.updateClass);
app.delete('/api/classes/:class_id', checkAuthentication, classControllers.deleteClass);

// ====================================
// Attendance record routes (all require authentication)
// ====================================

app.get('/api/attendance', checkAuthentication, attendanceControllers.listRecords);
app.get('/api/attendance/stats', checkAuthentication, attendanceControllers.getStats);
app.post('/api/attendance', checkAuthentication, attendanceControllers.createRecord);
app.patch('/api/attendance/:record_id', checkAuthentication, attendanceControllers.updateRecord);
app.delete('/api/attendance/:record_id', checkAuthentication, attendanceControllers.deleteRecord);

// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));