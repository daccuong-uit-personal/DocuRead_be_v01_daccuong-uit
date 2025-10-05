const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const routes = require('./index.route');
app.use('/api', routes);

// Default
app.get('/', (req, res) => {
  res.json({ message: 'DocuRead API is running 🚀' });
});

// Start server
const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at: http://localhost:${PORT}`);
  });
})();