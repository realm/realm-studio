// Initialize the Sentry for early error catching
// This is external to the bundle and will be copied by WebPack to catch any errors that may happen early

const isProduction = process.env.NODE_ENV !== 'development';

const Sentry = require('@sentry/electron');
Sentry.init({
  dsn: 'https://0e6521b5e2c44f6b82e6400a1886a8f5@sentry.io/1226926',
  environment: isProduction ? 'production' : 'development',
});
