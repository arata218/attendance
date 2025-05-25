import { useState } from "preact/hooks";

export default function DateForm(
  { dateStr }: { dateStr: string },
) {
  const [selected, setSelected] = useState<string>("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (selected) {
      globalThis.location.href = `/?dateStr=${
        encodeURIComponent(dateStr)
      }&result=${selected}`;
    }
  };

  return (
    <form class="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
      <div class="flex gap-8">
        <label class="flex items-center gap-2 text-xl">
          <input
            type="radio"
            name="result"
            value="出席"
            checked={selected === "出席"}
            onChange={() => setSelected("出席")}
            class="w-5 h-5"
          />
          出席
        </label>
        <label class="flex items-center gap-2 text-xl">
          <input
            type="radio"
            name="result"
            value="欠席"
            checked={selected === "欠席"}
            onChange={() => setSelected("欠席")}
            class="w-5 h-5"
          />
          欠席
        </label>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-6 py-2 rounded text-white text-lg"
        disabled={!selected}
      >
        入力決定
      </button>
    </form>
  );
}
