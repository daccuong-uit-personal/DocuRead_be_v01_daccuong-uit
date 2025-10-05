const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { sqlQuery } = require('./server/helpers/sqlQuery');
const { initAllViewConfig } = require('./server/helpers/viewConfig');
const defaultColumns = require('./config/defaultColumn');

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

  const rolesRes = await sqlQuery('SELECT id FROM roles');
  if (rolesRes.success && rolesRes.data.length > 0) {
    const roles = rolesRes.data;
    if (defaultColumns){
      const modules = defaultColumns.map(m => m.code);
      await initAllViewConfig(modules, roles);
      console.log('✅ Default columns đã được init vào DB');
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at: http://localhost:${PORT}`);
  });
})();