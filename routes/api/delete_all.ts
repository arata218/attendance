import { Handlers } from "$fresh/server.ts";

const USERNAME = Deno.env.get("USERNAME");
const PASSWORD = Deno.env.get("PASSWORD");

export const handler: Handlers = {
  async POST(req) {
    const authHeader = req.headers.get("authorization");
    const expected = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);

    if (authHeader !== expected) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Protected Area"',
        },
      });
    }

    const kv = await Deno.openKv();
    let count = 0;

    for await (const entry of kv.list({ prefix: [] })) {
      await kv.delete(entry.key);
      count++;
    }

    return new Response(`Deleted ${count} entries from KV`);
  },
};
