const fs = require('node:fs');
const path = require('node:path');

const logDirectory = path.join(__dirname, '..', '..', 'logs');
const logFile = path.join(logDirectory, 'requests.log');

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ...(req.method === 'POST' || req.method === 'PUT' ? { body: req.body } : {})
  };

  const formattedEntry = JSON.stringify(logEntry);
  console.log(`[REQUEST] ${formattedEntry}`);

  // Keep a persistent local log as well as printing to the terminal.
  try {
    fs.mkdirSync(logDirectory, { recursive: true });
    fs.appendFileSync(logFile, `${formattedEntry}\n`);
  } catch (error) {
    console.error('[LOGGER ERROR] Could not write request log:', error.message);
  }

  next();
}

module.exports = requestLogger;
