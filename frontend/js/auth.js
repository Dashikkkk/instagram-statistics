(async () => {
    const authTokenName = "auth_token";
    const tokenFromCookie = Cookies.get(authTokenName);

    if (tokenFromCookie !== undefined) {
        localStorage.setItem(authTokenName, tokenFromCookie);
        Cookies.remove(authTokenName);
    }

    const tokenFromLocalStorage = localStorage.getItem(authTokenName);
    if (tokenFromLocalStorage === null) {
        routeToLogin();
    }

    const day = moment().unix();
    const payload = parseJwt(tokenFromLocalStorage);
    const timeOfToken = payload.exp;


    if (!payload || timeOfToken < day) {
        localStorage.removeItem(authTokenName);
        routeToLogin()

    } else if (timeOfToken - day <= 259200) {
        try {
            const result = await doApiRequest(
                '/api/v1/auth/refresh',
                {},
                tokenFromLocalStorage
            );
            localStorage.setItem(authTokenName, result.jwt);
        } catch (error) {
            localStorage.removeItem(authTokenName);
            routeToLogin();
        }
    }
})();








