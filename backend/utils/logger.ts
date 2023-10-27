const { env } = process;
const LOG_LEVEL: `production` | `warn` | `info` =
  env.NODE_ENV === 'production' ? 'warn' : 'info';

const winston = require('winston');
require('winston-mongodb');

const { format, transports } = winston;

const logFormat = format.printf(
  ({
    level,
    message,
    timestamp,
  }: {
    level: string;
    message: string;
    timestamp: string;
  }) => `${timestamp} ${level}: ${message}`,
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

function logAndThrow<Type>(
  jobs: PromiseSettledResult<Type>[],
  message: string,
): Type[] {
  const errors = (
    jobs.filter((j) => j.status !== 'fulfilled') as PromiseRejectedResult[]
  ).map((j) => j.reason);
  errors.forEach((error) =>
    logger.error(`${message} ${error.message}`, { error }),
  );
  if (errors.length) {
    throw new Error(message);
  }
  return (
    jobs.filter(
      (j) => j.status === 'fulfilled',
    ) as PromiseFulfilledResult<Type>[]
  ).map((j) => j.value);
}

function reportError(error: unknown, template: string) {
  if (error instanceof Error) {
    logger.error(`${template}: ${error.message}.`, { error });
  } else {
    logger.error(`Thrown error is not an error: ${template}: ${error}`, {
      error,
    });
  }
}

module.exports = { logger, logAndThrow, reportError };
