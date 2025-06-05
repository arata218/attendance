import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req) {
    const { dateStr, value } = await req.json();
    const kv = await Deno.openKv();
    await kv.set(["attendance", dateStr], value);
    return new Response("ok");
  },

  async GET(req) {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("dateStr");
    const month = url.searchParams.get("month");

    // dateStrパラメータがある場合は特定の日付のデータを取得
    if (dateStr) {
      const kv = await Deno.openKv();
      const res = await kv.get(["attendance", dateStr]);
      return new Response(JSON.stringify(res.value ?? {}), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // monthパラメータがある場合は月のデータを取得
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

    return new Response("Either dateStr or month parameter is required", {
      status: 400,
    });
  },
};
