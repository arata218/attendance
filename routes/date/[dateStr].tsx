import { Handlers, PageProps } from "$fresh/server.ts";
import DateForm from "../../islands/DateForm.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { dateStr } = ctx.params;
    const kv = await Deno.openKv();
    const res = await kv.get(["attendance", dateStr]);
    const attendance = res.value ?? {};
    return ctx.render({ dateStr, attendance });
  },

  async POST(req, _ctx) {
    const form = await req.formData();
    const dateStr = form.get("dateStr") as string;
    const value = JSON.parse(form.get("value") as string);
    const kv = await Deno.openKv();
    await kv.set(["attendance", dateStr], value);
    const redirectUrl = new URL("/", req.url).toString();
    return Response.redirect(redirectUrl, 303);
  },
};

export default function DatePage(
  { data }: PageProps<
    {
      dateStr: string;
      attendance: Record<string, { status: string; time?: string }>;
    }
  >,
) {
  return (
    <div class="flex flex-col justify-center items-center bg-zinc-100 py-4 sm:py-8 md:py-12 min-h-screen">
      <DateForm dateStr={data.dateStr} attendance={data.attendance} />
    </div>
  );
}
