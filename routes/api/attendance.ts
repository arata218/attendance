import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  // GETは月集計APIのみ残す
  async GET(req) {
    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    if (month) {
      const kv = await Deno.openKv();
      const [year, m] = month.split("-").map(Number);
      const last = new Date(year, m, 0).getDate();
      const dates = Array.from(
        { length: last },
        (_, i) =>
          `${year}-${String(m).padStart(2, "0")}-${
            String(i + 1).padStart(2, "0")
          }`,
      );
      const results = await Promise.all(
        dates.map(async (date) => {
          const res = await kv.get(["attendance", date]);
          return [date, res.value ?? {}];
        }),
      );
      return new Response(JSON.stringify(Object.fromEntries(results)), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("month parameter is required", { status: 400 });
  },
};
