/**
 * @module common
 */

const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

let login_token;
let login_user_id;

/**
 * Performs login using process.env.TEST_USER and process.env.TEST_PASSWORD
 * Sets global variable login_token
 *
 * @returns {Promise} Promise object representing the login request
 */
async function login() {
    const response = await httpPost('/api/users/login', {
        USER_EMAIL:process.env.TEST_USER,
        USER_PASSWORD:process.env.TEST_PASSWORD
    });
    const data = JSON.parse(response.text);
    login_token = data.token;

    const user = await jwt.verify(login_token, process.env.JWT_SECRET);
    login_user_id = user.USER_ID;
    console.log(`user found=${JSON.stringify(user)} login_user_id=${login_user_id}`);
}

/**
 * Returns the login user ID
 *
 * @returns {number} The ID of the logged-in user
 */
function getLoginUserId() {
    return login_user_id;
}

/**
 * Sends a GET request to the specified URL with the authorization header set to the login token
 *
 * @param {string} url - The URL to send the request to
 * @returns {Promise<Object>} The response object from the SuperTest library
 */
async function httpGet(url) {
    return await request(app)
        .get(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`);
}

/**
 * Sends a POST request to the specified URL with the authorization header set to the login token
 *
 * @param {string} url - The URL to send the request to
 * @param {Object} payload - The payload to send in the request body
 * @returns {Promise<Object>} The response object from the SuperTest library
 */
async function httpPost(url, payload) {
    return await request(app)
        .post(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`)
        .send(payload);
}

/**
 * Sends a PUT request to the specified URL with the authorization header set to the login token
 *
 * @param {string} url - The URL to send the request to
 * @param {Object} payload - The payload to send in the request body
 * @returns {Promise<Object>} The response object from the SuperTest library
 */
async function httpPut(url, payload) {
    return await request(app)
        .put(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`)
        .send(payload);
}

/**
 * Sends a DELETE request to the specified URL with the authorization header set to the login token
 *
 * @param {string} url - The URL to send the request to
 * @returns {Promise<Object>} The response object from the SuperTest library
 */
async function httpDelete(url, payload) {
    return await request(app)
        .delete(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`);
}

module.exports = {login, getLoginUserId, httpGet, httpPost, httpPut, httpDelete};
