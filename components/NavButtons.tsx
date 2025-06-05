export default function NavButtons({ dateStr }: { dateStr: string }) {
  return (
    <div class="flex justify-between items-center gap-1 sm:gap-2 w-full">
      <a
        href="/"
        class="bg-gray-200 hover:bg-gray-300 px-2 sm:px-4 md:px-6 py-2 rounded text-gray-800 text-sm sm:text-base md:text-lg transition-colors whitespace-nowrap"
      >
        戻る
      </a>
      <span class="font-bold text-base sm:text-xl md:text-2xl text-center whitespace-nowrap">
        {dateStr}
      </span>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-2 sm:px-4 md:px-6 py-2 rounded text-white text-sm sm:text-base md:text-lg whitespace-nowrap"
      >
        入力決定
      </button>
    </div>
  );
}
