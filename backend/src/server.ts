import app from './app';
import { logger } from './utils/logger';
import { config } from './config';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err);
  // Close server and exit process
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default server;