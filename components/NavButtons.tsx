export default function NavButtons({ dateStr }: { dateStr: string }) {
  return (
    <div class="flex justify-between items-center gap-2 w-full">
      <a
        href="/"
        class="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded text-gray-800 text-lg transition-colors"
      >
        戻る
      </a>
      <span class="font-bold text-2xl text-center">
        {dateStr}
      </span>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-6 py-2 rounded text-white text-lg"
      >
        入力決定
      </button>
    </div>
  );
}
