export function post(url, body) {
    return fetch(url, {
        body:JSON.stringify(body),
        method:"POST", 
        headers: {
            "content-type": "application/json"
        }
    }) 
}
