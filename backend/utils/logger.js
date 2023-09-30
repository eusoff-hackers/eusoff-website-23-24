const { env } = process;
const LOG_LEVEL = env.NODE_ENV === 'production' ? 'warn' : 'info';

const winston = require('winston');
require('winston-mongodb');

const { format, transports } = winston;

const logFormat = format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
);

const logger = winston.createLogger({
  format: format.combine(format.metadata()),
  transports: [
    new transports.Console({
      level: LOG_LEVEL,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.cli(),
        logFormat,
      ),
    }),
    new transports.File({
      filename: 'combined.log',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({ level: LOG_LEVEL, db: env.MONGO_URI }),
  ],
});

function logAndThrow(jobs, message) {
  const errors = jobs
    .filter((j) => j.status !== 'fulfilled')
    .map((j) => j.reason);
  errors.forEach((error) =>
    logger.error(`${message} ${error.message}`, { error }),
  );
  if (errors.length) {
    throw new Error(message);
  }
  return jobs.filter((j) => j.status === 'fulfilled').map((j) => j.value);
}

module.exports = { logger, logAndThrow };
