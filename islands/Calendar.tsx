import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef } from "preact/hooks";

function getEventColor(result: string) {
  if (result === "出席") return "#2563eb"; // 青
  if (result === "欠席") return "#dc2626"; // 赤
  return undefined;
}

export default function CalendarComponent() {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    // クエリから日付と出欠情報を取得
    const url = new URL(globalThis.location.href);
    const dateStr = url.searchParams.get("dateStr");
    const result = url.searchParams.get("result");

    const events = [];
    if (dateStr && result) {
      events.push({
        title: result,
        start: dateStr,
        color: getEventColor(result),
        textColor: "#ffffff",
        allDay: true,
      });
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
