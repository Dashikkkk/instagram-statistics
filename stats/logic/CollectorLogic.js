const __ = require('aigle');

class CollectorLogic {
    constructor(Parser, CollectorDAO, AccountDAO, PostDAO, UserDAO) {
        this._parser = Parser;
        this._collectorDAO = CollectorDAO;
        this._accountDAO = AccountDAO;
        this._postDAO = PostDAO;
        this._userDAO = UserDAO;
    }

    /**
     * Collect data from instagram, store them
     *
     * @param userId
     * @param instagramName
     * @returns {Promise<void>}
     */
    async collect(userId, instagramName) {
        const collectorId = await this._collectorDAO.start(userId);

        try {
            const data = await this._parser.get(instagramName);

            await this._accountDAO.saveAccountInfo(collectorId, data.stat);
            await __.forEach(data.posts, async (post) => {
                await this._postDAO.savePostInfo(collectorId, post);
            });

            await this._collectorDAO.success(collectorId);
            console.log(` [x] Complete for user: ${instagramName}<${userId}>`);
        } catch (err) {
            await this._collectorDAO.fail(collectorId, err);
        }
    }

    /**
     * Get users list to collect data for
     *
     * @returns {Promise<Array>}
     */
    async getUsersForCollect() {
        return await this._userDAO.getActiveUsers();
    }

    /**
     * Get last amount of collects for given user
     *
     * @param userId
     * @param amount
     * @returns {Promise<*|Array>}
     */
    async getLastCollects(userId, amount) {
        return await this._collectorDAO.getLastCollects(userId, amount);
    }
}

module.exports.default = CollectorLogic;