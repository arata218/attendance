import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef } from "preact/hooks";

export default function CalendarComponent() {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    // クエリから日付と出欠情報を取得
    const url = new URL(globalThis.location.href);
    const dateStr = url.searchParams.get("dateStr");
    const attendanceRaw = url.searchParams.get("attendance");
    const events = [];

    if (dateStr && attendanceRaw) {
      try {
        const attendance = JSON.parse(decodeURIComponent(attendanceRaw));
        // 出席・遅刻の人数カウント
        const presentCount = Object.values(attendance).filter(
          (v) => v === "出席" || (v && typeof v === "object" && "status" in v && v.status === "出席")
        ).length;
        const lateCount = Object.values(attendance).filter(
          (v) => v && typeof v === "object" && "status" in v && v.status === "遅刻"
        ).length;
        if (presentCount > 0) {
          events.push({
            title: `出席 ${presentCount}人`,
            start: dateStr,
            color: "#2563eb",
            textColor: "#fff",
            allDay: true,
          });
        }
        if (lateCount > 0) {
          events.push({
            title: `遅刻 ${lateCount}人`,
            start: dateStr,
            color: "#dc2626",
            textColor: "#fff",
            allDay: true,
          });
        }
      } catch (_) {
        // attendanceのパースに失敗した場合は何もしない
      }
    }

    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "today",
      },
      locale: "ja",
      events,
      dateClick: (info: { dateStr: string }) => {
        globalThis.location.href = `/date/${info.dateStr}`;
      },
    });
    calendar.render();

    return () => calendar.destroy();
  }, []);

  return (
    <div
      ref={calendarRef}
      class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"
    />
  );
}
