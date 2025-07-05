import fetch from "node-fetch";
const URL = "http://localhost";
export async function api(port, slug, args = {}) {
    const res = await fetch(`${URL}:${port}${slug}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
    });
    if (!res.ok) {
        throw new Error(`Failed to execute command(${slug}) with args: ${JSON.stringify(args)}`);
    }
    const json = (await res.json());
    if (!json.success) {
        throw new Error(`Failed to call API (${slug}): ${json.error}`);
    }
    return json.data;
}
