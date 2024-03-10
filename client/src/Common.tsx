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

    const response = await fetch(url, {
        method:'POST',
        headers: {
          'Content-Type':'application/json'
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

// export async function put(url: string, payload:object) {}

// export async function delete(url: string, payload:object) {}