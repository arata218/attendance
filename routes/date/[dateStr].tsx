import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { dateStr } = ctx.params;
    return ctx.render({ dateStr });
  },
};

export default function DatePage({ data }: PageProps<{ dateStr: string }>) {
  return (
    <div class="flex flex-col justify-center items-center bg-gray-50 min-h-screen">
      <h1 class="mb-4 font-bold text-2xl">選択した日付: {data.dateStr}</h1>
      <form class="flex gap-4">
        <button
          type="button"
          class="bg-green-100 hover:bg-green-200 px-6 py-2 rounded text-3xl"
        >
          ⭕️
        </button>
        <button
          type="button"
          class="bg-red-100 hover:bg-red-200 px-6 py-2 rounded text-3xl"
        >
          ❌
        </button>
      </form>
    </div>
  );
}
