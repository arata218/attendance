import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Calendar() {
  useEffect(() => {
    if (!IS_BROWSER) return;

    // スタイルシートの追加
    // const link = document.createElement("link");
    // link.href = "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/main.min.css";
    // link.rel = "stylesheet";
    // document.head.appendChild(link);

    // FullCalendarの読み込み
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js";
    script.async = true;
    script.onload = () => {
      const calendarEl = document.getElementById("calendar");
      if (!calendarEl) return;

      const calendar = new (window as any).FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next",
          center: "title",
          right: "today",
          // right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        locale: "ja",
        // events: [
        //   { title: "山田：出席", date: "2024-03-14", color: "green" },
        //   { title: "佐藤：欠席", date: "2024-03-14", color: "red" },
        // ],
        // dateClick: function (info: { dateStr: string }) {
        //   alert("選択された日付: " + info.dateStr);
        // },
      });
      calendar.render();
    };
    script.onerror = (error) => {
      console.error("カレンダーの読み込みに失敗しました:", error);
    };
    document.head.appendChild(script);

    return () => {
      // クリーンアップ
      // document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div class="p-4">
      <div
        id="calendar"
        class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4"
      />
    </div>
  );
}
