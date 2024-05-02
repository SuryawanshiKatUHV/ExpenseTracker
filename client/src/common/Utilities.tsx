/**
 * Constants for defining different views.
 */
export const VIEW = {
    LoginForm:"LoginForm", 
    RegistrationForm:"RegistrationForm", 
    AppHome:"AppHome"
};

/**
 * Constants for defining various functions or features.
 */
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

/**
 * Constants for defining API endpoints used.
 */
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
 * Interface for defining request parameters used in API calls.
 */
interface RequestParams {
    method: string;
    headers: {
      'Content-Type': string;
      Authorization: string;
    };
    body?: string; 
  }

/**
 * Interface for defining a year-month range.
 */
export interface YearMonthRange {
    Year: number;
    Month: number;
}

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
async function invokeWS(method:string, url:string, payload?:object) {
    if (payload) {
        console.log(`invokeWS(method=${method}, url=${url}, payload=${JSON.stringify(payload)})`);
    }
    else {
        console.log(`invokeWS(method=${method}, url=${url})`);
    }
    
    // Set up request parameters including authentication token retrieved from local storage
    const token = localStorage.getItem('login_token');
    let requestParams:RequestParams = {
        method,
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

    // Add payload to request if provided
    if (payload) {
        const strPayload = JSON.stringify(payload);
        console.log(`Payload=${strPayload}`);
        requestParams.body = strPayload;
    }

    // Send request and handle response
    const response = await fetch(url, requestParams);
    console.log(`response.status=${response.status}`);
    console.log(`response.statusText=${response.statusText}`);

    const data = await response.json();  
    console.log(`response.json()=${JSON.stringify(data)}`);

    // Throw error if response is not successful
    if (!response.ok) {
        const message = `HTTP error ${response.status} - ${response.statusText} : ${data.message}`;
        console.error(message);
        throw new Error(message);
    }

    // Return response data if successful
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
    return await invokeWS("POST", url, payload);
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
    return await invokeWS("PUT", url, payload);
}

/**
 * Invokes a web service with the HTTP GET method.
 *
 * @param {string} url - The URL of the web service endpoint.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
export async function get(url:string) {
    return await invokeWS("GET", url);
}

/**
 * Invokes a web service with the HTTP DELETE method.
 *
 * @param {string} url - The URL of the web service endpoint.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response data from the web service.
 * @throws {Error} If the web service request fails, an Error is thrown with the HTTP status code and message.
 */
export async function del(url:string) {
    return await invokeWS("DELETE", url);
}

/**
 * Parses a string to YearMonthRange object
 * 
 * @param stringYearMonth A string in the format 'yyyy-mm'
 * @returns YearMonthRange object
 */
export function stringToYearMonth(stringYearMonth : string) : YearMonthRange {
    if (!stringToYearMonth) {
        throw new Error(`stringToYearMonth is required.`);
    }
    const tokens = stringYearMonth?stringYearMonth.split("-"):[];
    if (tokens.length != 2) {
        throw new Error(`stringToYearMonth '${stringToYearMonth}' is not in required format of 'yyyy-mm'`)
    }

    return {Year:Number(tokens[0]), Month:Number(tokens[1])};
}

/*
 * Formats a date into the yyyy-mm-dd format
 * 
 * @param {Date} date - The date to be formatted
 * @returns {string} The formatted date string
 */
export function formatDate (date: Date) {
    let year = date.getFullYear();

    // Pad month and day with leading zeros if necessary
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Converts date string to date object
 * 
 * @param dateString Date in format "yyyy-mm-dd"
 * @returns Date object
 */
export function stringToDate (dateString: string) {
    const dateTokens : string[] = dateString.split("-");
    const dateWithoutTime = new Date(Number(dateTokens[0]), Number(dateTokens[1]) - 1, Number(dateTokens[2]));
    return dateWithoutTime;
}

/*
 * Converts a string formatted as yyyy-mm-dd to a Date object representing the first day of the month.
 * 
 * @param {string} dateString - The string representing the date in the format yyyy-mm-dd
 * @returns {Date} A Date object representing the first day of the month
 */
export function stringToDateAsFirstOfTheMonth (dateString: string) {
    const dateTokens : string[] = dateString.split("-");
    const dateWithoutTime = new Date(Number(dateTokens[0]), Number(dateTokens[1]) - 1, 1);
    return dateWithoutTime;
}