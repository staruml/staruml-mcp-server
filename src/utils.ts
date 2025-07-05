import fetch from "node-fetch";

const URL = "http://localhost";

type CommandResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function api(port: number, slug: string, args: any = {}) {
  const res = await fetch(`${URL}:${port}${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to execute command(${slug}) with args: ${JSON.stringify(args)}`
    );
  }
  const json = (await res.json()) as CommandResponse;
  if (!json.success) {
    throw new Error(`Failed to call API (${slug}): ${json.error}`);
  }
  return json.data;
}
