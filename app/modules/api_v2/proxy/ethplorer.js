const request = require('../../request');

function ethplorer(name, address, get, post, callback) {
    let data_get = ''; // user_id=500150&
    let data_post = ''; // user_id=500150&
    for (let i in get) {
        if (get.hasOwnProperty(i))
            data_get += i + '=' + get[i] + '&';
    }
    for (let i1 in post) {
        if (post.hasOwnProperty(i1))
            data_post += i1 + '=' + post[i1] + '&';
    }
    let option = {
        rejectUnauthorized: false,
        host: 'api.ethplorer.io',
        port: 443,
        path: '/' + name + '/' + address + '?' + data_get,
        method: 'POST',
        formData: data_post,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request.getJSON(option, (statusCode, response) => {
        if (statusCode === 200 && Object.prototype.isPrototypeOf(response)) {
            callback && callback(null, response);
        } else {
            console.error('response', Object.prototype.isPrototypeOf(response), response);
            callback && callback('Error ethplorer API [' + '/en/api/' + ']. ( https://' + option.host + option.path + '?' + option.formData + ' ) Response code: ' + statusCode, null);
        }
    });
}

module.exports = ethplorer;