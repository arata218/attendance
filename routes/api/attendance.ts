import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const { dateStr, value } = await req.json();
    const kv = await Deno.openKv();
    await kv.set(["attendance_by_date", dateStr], value);
    // const res = await kv.get(["attendance_by_date", dateStr]);
    // console.log(res.value);
    console.log(new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    }));
    for await (const entry of kv.list({ prefix: [] })) {
      console.log("KEY:", entry.key, "VALUE:", entry.value);
    }
    return new Response("ok");
  },
};
