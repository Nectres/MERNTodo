export function post(url, body) {
    return fetch(url, {
        body:JSON.stringify(body), 
        headers: {
            "content-type": "application/json"
        }
    }) 
}
