import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef } from "preact/hooks";

export default function CalendarComponent() {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "today",
      },
      locale: "ja",
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
