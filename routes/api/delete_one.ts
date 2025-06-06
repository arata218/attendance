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

    const body = await req.json();

    if (!Array.isArray(body.key)) {
      return new Response("Invalid key format", { status: 400 });
    }

    const kv = await Deno.openKv();
    await kv.delete(body.key);

    return new Response("Deleted successfully");
  },
};
