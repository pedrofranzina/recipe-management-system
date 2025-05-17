import storeService from './storeService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function get(url, auth = false) {
    const init = {};
    if (auth) {
        init.headers = { authorization: "Bearer " + storeService.getToken() };
    }
    const response = await fetch(`${BASE_URL}${url}`, init);
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Failed to fetch data');
}

async function post(url, data, auth = false) {
    const init = {
        method: 'POST',
        headers: {},
        body: data instanceof FormData ? data : JSON.stringify(data)
    };

    // Only set Content-Type for JSON data
    if (!(data instanceof FormData)) {
        init.headers['Content-Type'] = 'application/json';
    }

    if (auth) {
        init.headers.authorization = "Bearer " + storeService.getToken();
    }

    const response = await fetch(`${BASE_URL}${url}`, init);
    if (response.ok) {
        return await response.json();
    }
    
    const errorData = await response.json();
    if (response.status === 401) {
        throw new Error('Incorrect username or password');
    }
    throw new Error(errorData.message || 'Failed to create recipe');
}

async function put(url, data, auth = false) {
    const init = {
        method: 'PUT',
        headers: {},
        body: data instanceof FormData ? data : JSON.stringify(data)
    };

    // Only set Content-Type for JSON data
    if (!(data instanceof FormData)) {
        init.headers['Content-Type'] = 'application/json';
    }

    if (auth) {
        init.headers.authorization = "Bearer " + storeService.getToken();
    }

    const response = await fetch(`${BASE_URL}${url}`, init);
    if (response.ok) {
        return await response.json();
    }
    
    const errorData = await response.json().catch(() => ({ message: 'Failed to update data' }));
    throw new Error(errorData.message || 'Failed to update data');
}

async function del(url, auth = false) {
    const init = {
        method: 'DELETE',
    };

    if (auth) {
        init.headers = {
            authorization: "Bearer " + storeService.getToken(),
        };
    }

    const response = await fetch(`${BASE_URL}${url}`, init);
    if (response.ok) {
        return await response.json();
    }
    throw new Error('Failed to delete data');
}

export default {
    get,
    post,
    put,
    delete: del
}; 