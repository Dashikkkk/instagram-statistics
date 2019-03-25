class UserLogic {
    constructor(UserDAO) {
        this._userDAO = UserDAO;
    }

    /**
     * updates login data for current user
     *
     * @param data (data.token, data.user.instagramId, data.user.name, data.user.fullName, data.ip)
     * @returns {Promise<void>}
     */
    async updateLoginData(data) {
       await this._userDAO.saveUserInfo(
            data.user.instagramId,
            {
                userName: data.user.userName,
                fullName: data.user.fullName,
                ip: data.ip,
                accessToken: data.token,
            }
        )
    }
}

module.exports.default = UserLogic;