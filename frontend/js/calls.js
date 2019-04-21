function routeToLogin() {
    window.location = '/login.html';
}

function doApiRequest(url, payload, token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            data: payload,
            success: (result) => {
                resolve(result);

            },
            error: (error) => {
                reject(error);
            },
        });
    });
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+')
        .replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}