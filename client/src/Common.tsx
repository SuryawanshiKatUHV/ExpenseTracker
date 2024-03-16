export const VIEW = {
    LoginForm:"LoginForm", 
    RegistrationForm:"RegistrationForm", 
    AppHome:"AppHome"
};

export const FUNCTIONS = {
    Dashboard:"Dashboard", 
    DashboardForTransactions:"Dashboard For Transactions",
    DashboardForGroupTransactions:"Dashboard For Group Transactions",
    Categories:"Categories", 
    Budgets:"Budgets", 
    Transactions:"Transactions", 
    Groups:"Groups", 
    GroupTransactions:"Group Transactions"
};

export const END_POINTS = {
    Users:"/api/users",
    Login:"/api/users/login",
    Categories:`/api/categories`,
    Budgets:`/api/budgets`,
    Transactions:`/api/transactions`,
    Groups:`/api/groups`,
    GroupTransactions:`/api/groupTransactions`
};

/**
 * Invokes a web service with the specified HTTP method, URL, and payload.
 *
 * @async
 * @param {string} method - The HTTP method to use (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {string} url - The URL of the web service endpoint.
 * @param {Object} payload - The JSON payload to send with the request.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
async function invokeWS(method:string, url:string, payload:object) {
    console.log(`invokeWS(method=${method}, url=${url}, payload=${JSON.stringify(payload)})`);

    const strPayload = JSON.stringify(payload);
    console.log(`Payload=${strPayload}`);

    const token = localStorage.getItem('login_token');
    const response = await fetch(url, {
        method,
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: strPayload,
      });
    console.log(`response.status=${response.status}`);
    console.log(`response.statusText=${response.statusText}`);

    const data = await response.json();  
    console.log(`response.json()=${JSON.stringify(data)}`);

    if (!response.ok) {
        const message = `HTTP error ${response.status} - ${response.statusText} : ${data.message}`;
        console.error(message);
        throw new Error(message);
    }

    return data;
}

/**
 * Invokes a web service with the HTTP POST method.
 *
 * @param {string} url - The URL of the web service endpoint.
 * @param {Object} payload - The JSON payload to send with the POST request.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
export async function post(url:string, payload:object) {
    return invokeWS("POST", url, payload);
}

/**
 * Invokes a web service with the HTTP PUT method.
 *
 * @param {string} url - The URL of the web service endpoint.
 * @param {Object} payload - The JSON payload to send with the PUT request.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
export async function put(url:string, payload:object) {
    return invokeWS("PUT", url, payload);
}

/**
 * Invokes a web service with the HTTP GET method.
 *
 * @param {string} url - The URL of the web service endpoint.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
export async function get(url:string) {
    return invokeWS("GET", url, {});
}

/**
 * Invokes a web service with the HTTP DELETE method.
 *
 * @param {string} url - The URL of the web service endpoint.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
export async function del(url:string) {
    return invokeWS("DELETE", url, {});
}
