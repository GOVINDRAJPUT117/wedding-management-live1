import axios from "axios";

class WebServices {
    // POST request without token
    postAPICall(url, data) {
        var result = axios.post(url, data, { withCredentials: true });
        return result;
    }

    // GET request without token
    getAPICall(url) {
        var result = axios.get(url, { withCredentials: true });
        return result;
    }

    // POST request with token
    postAPIUsingToken(url, data, token) {
        var result = axios.post(url, data, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            withCredentials: true  // Optional, only if cookies are needed
        });
        return result;
    }

    // GET request with token
    getAPIUsingToken(url, token) {
        var result = axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            withCredentials: true  // Optional, only if cookies are needed
        });
        return result;
    }

    // DELETE request with token
    deleteAPIUsingToken(url, token) {
        var result = axios.delete(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            withCredentials: true  // Optional, only if cookies are needed
        });
        return result;
    }

    // PUT request with token
    updateAPIUsingToken(url, data, token) {
        var result = axios.put(url, data, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            withCredentials: true  // Optional, only if cookies are needed
        });
        return result;
    }

    // DELETE request with token (alternate naming)
    deleteAPIUsingTokenAlt(url, token) {
        var result = axios.delete(url, {
            headers: {
                Authorization: 'Bearer ' + token
            },
            withCredentials: true  // Optional, only if cookies are needed
        });
        return result;
    }
}

export default new WebServices();
