const axios = require("axios");

var retryCount;
axios.defaults.retry = 6;
axios.defaults.retryDelay = 2000;
axios.defaults.timeout = 6 * 1000;
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    if(!config) return Promise.reject(err);

    config.__retryCount = config.__retryCount || 0;

    console.log(config.__retryCount)

    if(config.__retryCount >= axios.defaults.retry) {
        return Promise.reject(err);
    }

    config.__retryCount += 1;

    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, axios.defaults.retryDelay || 1000);
    });

    return backoff.then(function() {
        return axios(config);
    });
});

module.exports = (url, params) => {
    return axios.post(url, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
};