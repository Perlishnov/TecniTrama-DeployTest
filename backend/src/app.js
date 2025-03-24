require("dotenv").config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

module.exports = app;


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
