const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

let login_token;
let login_user_id;

/**
 * Performs login using process.env.TEST_USER and process.env.TEST_PASSWORD
 * Sets global variable login_token
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

function getLoginUserId() {
    return login_user_id;
}

async function httpGet(url) {
    return await request(app)
        .get(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`);
}

async function httpPost(url, payload) {
    return await request(app)
        .post(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`)
        .send(payload);
}

async function httpPut(url, payload) {
    return await request(app)
        .put(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`)
        .send(payload);
}

async function httpDelete(url, payload) {
    return await request(app)
        .delete(url)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${login_token}`);
}

module.exports = {login, getLoginUserId, httpGet, httpPost, httpPut, httpDelete}
