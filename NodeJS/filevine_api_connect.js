/**
 * Requirements:
 * const axios = require('axios');
 * const crypto = require('crypto');
 */

const API_KEY = "***";
const SECRET_KEY = "***";

async getFilevineToken() {

    let timestamp = new Date().toISOString();
    let data = [
        API_KEY,
        timestamp,
        SECRET_KEY,
    ].join('/');

    let payload = {
        mode: 'key',
        apiKey: API_KEY,
        apiHash: crypto.createHash('md5').update(data).digest('hex'),
        apiTimestamp: timestamp,
    };

    let response = await axios.post("https://api.filevine.io/session", payload, {
        headers: {
            'content-type': 'application/json',
        },
        validateStatus: () => true,
    });

    /** For Postman use **/
    // console.log("Authorization:");
    // Assign to Authorization key value header request "Bearer ***TOKEN***"
    // console.log(response.data.accessToken);
    // console.log("x-fv-sessionid:");
    // Assign to x-fv-sessionid key value header request
    // console.log(response.data.refreshToken);

    return response.data;
}