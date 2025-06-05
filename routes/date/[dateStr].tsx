import { Handlers, PageProps } from "$fresh/server.ts";
import DateForm from "../../islands/DateForm.tsx";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { dateStr } = ctx.params;
    return ctx.render({ dateStr });
  },
};

export default function DatePage(
  { data }: PageProps<{ dateStr: string }>,
) {
  return (
    <div class="flex flex-col justify-center items-center bg-zinc-100 min-h-screen py-4 sm:py-8 md:py-12">
      <DateForm dateStr={data.dateStr} />
    </div>
  );
}
