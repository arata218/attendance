import { Handlers, PageProps } from "$fresh/server.ts";
import type { AttendanceValue } from "../../islands/Calendar.tsx";
import DateForm from "../../islands/DateForm.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { dateStr } = ctx.params;
    const kv = await Deno.openKv();
    const res = await kv.get(["attendance", dateStr]);
    const versionstamp = res.versionstamp ?? "";
    const attendance = res.value ?? {};
    return ctx.render({
      dateStr,
      versionstamp,
      attendance,
      error: null,
    });
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const dateStr = form.get("dateStr") as string;
    const versionstamp = form.get("versionstamp") as string;
    const value = JSON.parse(form.get("value") as string) as Record<
      string,
      AttendanceValue
    >;
    const kv = await Deno.openKv();
    // versionstampを使ってチェック
    if (versionstamp) {
      const res = await kv.atomic()
        .check({ key: ["attendance", dateStr], versionstamp })
        .set(["attendance", dateStr], value)
        .commit();
      if (!res.ok) {
        const current = await kv.get(["attendance", dateStr]);
        return ctx.render({
          dateStr,
          attendance: current.value ?? {},
          error: "保存に失敗しました。再度入力して下さい。",
          versionstamp: current.versionstamp,
        });
      }
    } else {
      await kv.set(["attendance", dateStr], value);
    }
    const redirectUrl = new URL("/", req.url).toString();
    return Response.redirect(redirectUrl, 303);
  },
};

export default function DatePage(
  { data }: PageProps<
    {
      dateStr: string;
      versionstamp: string;
      attendance: Record<string, { status: string; time?: string }>;
      error?: string | null;
    }
  >,
) {
  return (
    <div class="flex flex-col justify-center items-center bg-zinc-100 py-4 sm:py-8 md:py-12 min-h-screen">
      <DateForm
        dateStr={data.dateStr}
        versionstamp={data.versionstamp}
        attendance={data.attendance}
        error={data.error}
      />
    </div>
  );
}
