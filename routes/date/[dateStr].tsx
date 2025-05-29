import { Handlers, PageProps } from "$fresh/server.ts";
import DateForm from "../../islands/DateForm.tsx";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { dateStr } = ctx.params;
    return ctx.render({ dateStr });
  },
};

export default function DatePage(
  { data }: PageProps<{ dateStr: string; selected: string }>,
) {
  return (
    <div class="flex flex-col justify-center items-center bg-zinc-100 min-h-screen">
      <h1 class="mb-4 font-bold text-2xl">選択した日付: {data.dateStr}</h1>
      <DateForm dateStr={data.dateStr} />
    </div>
  );
}
