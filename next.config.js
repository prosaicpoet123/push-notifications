require('dotenv').config();
const withPlugins = require('next-compose-plugins');
const withOffline = require('next-offline');

module.exports = withPlugins([withOffline], {
    webpack: (config) => {
        return config;
    },
    publicRuntimeConfig: {
        VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || '',
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || ''
    }
});
