// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

/** @type {import('next').NextConfig} */

module.exports = {
  eslint: {
    dirs: ['src'],
  },
  reactStrictMode: true,
  publicRuntimeConfig: {
    APP_VERSION: pkg.version || 'unknown',
    PORTAL_ADDRESS: process.env.PORTAL_ADDRESS || '',
    INFANTRY_ADDRESS: process.env.INFANTRY_ADDRESS || '',
    BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY || '',
    INFURA_API_KEY: process.env.INFURA_API_KEY || '',
    PRESALE_CONTRACT_ADDRESS: process.env.PRESALE_CONTRACT_ADDRESS || '',
    PRESALE_START_DATE: process.env.PRESALE_START_DATE || '',
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY || '',
    RELEASE_ENV: process.env.RELEASE_ENV || 'development',
    SALE_CONTRACT_ADDRESS: process.env.SALE_CONTRACT_ADDRESS || '',
    SALE_END_DATE: process.env.SALE_END_DATE || '',
    SALE_START_DATE: process.env.SALE_START_DATE || '',
    ZENDESK_URL: process.env.ZENDESK_URL || '',
  },
  serverRuntimeConfig: {
    METALCORE_GAME_ID: process.env.METALCORE_GAME_ID || '',
    NEMESIS_API_URL: process.env.NEMESIS_API_URL || '',
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
    STARS_API_URL: process.env.STARS_API_URL || '',
  },
};
