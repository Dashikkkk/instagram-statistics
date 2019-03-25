const Instagram = require('node-instagram').default;

const instagramObj = new Instagram({
    clientId: process.env.instagram_client_id,
    clientSecret: process.env.instagram_client_secret,
});

module.exports = instagramObj;