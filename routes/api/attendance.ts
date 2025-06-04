import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const { dateStr, value } = await req.json();
    const kv = await Deno.openKv();
    await kv.set(["attendance_by_date", dateStr], value);
    return new Response("ok");
  },
};
