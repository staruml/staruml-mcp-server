import fetch from "node-fetch";
// (StarUML listens on the IPv4 loopback address only, and `localhost` may resolve to ::1)
const URL = "http://127.0.0.1";
// name of this app shown in the dialog of StarUML asking for API access
const APP_NAME = "StarUML MCP Server";
/**
 * API token granted by the user in StarUML.
 * - `undefined`: not requested yet
 * - `null`: not needed (StarUML v7 has no token API)
 */
let apiToken = undefined;
// pending token request (concurrent calls share one dialog in StarUML)
let tokenRequest = null;
async function requestApiToken(port) {
    const res = await fetch(`${URL}:${port}/request_api_token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appName: APP_NAME }),
    });
    if (res.status === 404) {
        return null;
    }
    const json = (await res.json().catch(() => null));
    if (!res.ok || !json?.success || typeof json.data !== "string") {
        throw new Error(`Failed to get API access to StarUML: ${json?.error ?? res.statusText}`);
    }
    return json.data;
}
/**
 * Get the API token. StarUML asks the user to allow the access when a new token is requested.
 * @param expired the token rejected by StarUML (e.g. StarUML was restarted)
 */
async function getApiToken(port, expired) {
    if (expired !== undefined && apiToken === expired) {
        apiToken = undefined;
    }
    if (apiToken !== undefined) {
        return apiToken;
    }
    if (!tokenRequest) {
        tokenRequest = requestApiToken(port)
            .then((token) => {
            apiToken = token;
            return token;
        })
            .finally(() => {
            tokenRequest = null;
        });
    }
    return tokenRequest;
}
function post(port, slug, args, token) {
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(`${URL}:${port}${slug}`, {
        method: "POST",
        headers,
        body: JSON.stringify(args),
    });
}
export async function api(port, slug, args = {}) {
    let token = await getApiToken(port);
    let res = await post(port, slug, args, token);
    if (res.status === 401) {
        // the token is invalid (e.g. StarUML was restarted), request a new one
        token = await getApiToken(port, token);
        res = await post(port, slug, args, token);
    }
    if (!res.ok) {
        const json = (await res.json().catch(() => null));
        throw new Error(`Failed to execute command(${slug}) with args: ${JSON.stringify(args)}${json?.error ? ` (${json.error})` : ""}`);
    }
    const json = (await res.json());
    if (!json.success) {
        throw new Error(`Failed to call API (${slug}): ${json.error}`);
    }
    return json.data;
}
