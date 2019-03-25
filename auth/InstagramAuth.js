const InstagramApi = require('node-instagram').default;

class InstagramAuth {
    constructor() {
        this._api = new InstagramApi({
            clientId: process.env.instagram_client_id,
            clientSecret: process.env.instagram_client_secret,
        });
        this._redirectUrl = process.env.instagram_redirect_url
    }

    getUrl() {
        return this._api.getAuthorizationUrl(
            encodeURIComponent(this._redirectUrl),
            {scope: ['basic']}
        );
    }

    async authorize(code) {
        return await this._api.authorizeUser(code, this._redirectUrl);
    }
}

module.exports.default = InstagramAuth;