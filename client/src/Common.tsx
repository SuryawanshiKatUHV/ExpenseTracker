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
 * Invokes web servie with HTTP POST method 
 * @param url The endpoint for the web service
 * @param payload The json object which is input to the webservice
 * @returns json object as data when web service is successfully completed
 */
export async function post(url:string, payload:object) {
    console.log(`POST=${url}`);

    const strPayload = JSON.stringify(payload);
    console.log(`Payload=${strPayload}`);

    const token = localStorage.getItem('login_token');
    const response = await fetch(url, {
        method:'POST',
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

// export async function get(url: string) {}
export async function get(url: string) {
    console.log(`GET=${url}`);

    const token = localStorage.getItem('login_token');

    // Sending the GET request
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Assuming the API requires authorization
            'Content-Type': 'application/json'
        }
    });

    console.log(`response.status=${response.status}`);
    console.log(`response.statusText=${response.statusText}`);

    // Attempting to parse the response
    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.error(`Error parsing JSON from response: ${error}`);
        throw new Error(`Error parsing JSON from response: ${error}`);
    }

    console.log(`response.json()=${JSON.stringify(data)}`);

    // Checking the response status
    if (!response.ok) {
        const message = `HTTP error ${response.status} - ${response.statusText} : ${data.message || 'Unknown error'}`;
        console.error(message);
        throw new Error(message);
    }

    // Returning the parsed data
    return data;
}


// export async function put(url: string, payload:object) {}

// export async function delete(url: string) {}