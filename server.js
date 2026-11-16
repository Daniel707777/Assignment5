const express = require('express');
const menuRoutes = require('./src/routes/menuRoutes');
const requestLogger = require('./src/middleware/requestLogger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON before logging so POST/PUT bodies are available to the logger.
app.use(express.json({ limit: '100kb' }));
app.use(requestLogger);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Tasty Bites API',
    endpoints: { menu: '/api/menu', documentation: 'Import postman/Tasty-Bites-API.postman_collection.json into Postman' }
  });
});

app.use('/api/menu', menuRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => console.log(`Tasty Bites API running at http://localhost:${PORT}`));
}

module.exports = app;
