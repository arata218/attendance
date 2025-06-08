import { Calendar, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef } from "preact/hooks";

export type AttendanceValue = { status: string; time?: string } | undefined;
type EventLike = {
  title: string;
  start: string;
  color: string;
  textColor: string;
  allDay: boolean;
};

export default function CalendarComponent() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<Calendar | null>(null);

  // 月の全日付分の出欠データを取得しevents生成
  const fetchMonthAttendance = async (month: string) => {
    try {
      const res = await fetch(
        `/api/attendance?month=${encodeURIComponent(month)}`,
      );
      if (!res.ok) {
        console.error(
          `Failed to fetch attendance data for ${month}:`,
          res.statusText,
        );
        return [];
      }
      const monthData: Record<string, Record<string, AttendanceValue>> =
        await res.json();
      const evts: EventLike[] = [];

      Object.entries(monthData).forEach(([dateStr, attendance]) => {
        const presentCount = Object.values(attendance).filter((v) =>
          v?.status === "出席"
        ).length;
        const lateCount = Object.values(attendance).filter((v) =>
          v?.status === "遅刻"
        ).length;
        const absentCount = Object.values(attendance).filter((v) =>
          v?.status === "欠席"
        ).length;
        const notInputCount =
          Object.values(attendance).filter((v) => v?.status === "").length;

        if (presentCount > 0 || lateCount > 0) {
          evts.push({
            title: `出${presentCount}遅${lateCount}`,
            start: dateStr,
            color: "#2563eb",
            textColor: "#fff",
            allDay: true,
          });
        }
        if (absentCount > 0 || notInputCount > 0) {
          evts.push({
            title: `欠${absentCount}未${notInputCount}`,
            start: dateStr,
            color: "#dc2626",
            textColor: "#fff",
            allDay: true,
          });
        }
      });
      return evts;
    } catch (error) {
      console.error(`Error fetching attendance data for ${month}:`, error);
      return [];
    }
  };

  useEffect(() => {
    if (!calendarRef.current) return;
    const today = new Date();
    const ym = `${today.getFullYear()}-${
      String(today.getMonth() + 1).padStart(2, "0")
    }`;

    (async () => {
      const evts = await fetchMonthAttendance(ym);
      const calendar = new Calendar(calendarRef.current!, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next",
          center: "title",
          right: "today",
        },
        locale: "ja",
        events: evts,
        height: "auto",
        contentHeight: "auto",
        aspectRatio: 1.35,
        views: {
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "short" },
            dayHeaderFormat: { weekday: "short" },
            dayMaxEvents: true,
          },
        },
        dayCellContent: function (arg: { dayNumberText: string; date: Date }) {
          // JSTで日付数字部分のみリンク化
          const y = arg.date.getFullYear();
          const m = String(arg.date.getMonth() + 1).padStart(2, "0");
          const d = String(arg.date.getDate()).padStart(2, "0");
          const dateStr = `${y}-${m}-${d}`;
          return {
            html:
              `<a href="/date/${dateStr}" class="fc-date-number">${arg.dayNumberText}</a>`,
          };
        },
        datesSet: async (_info: DatesSetArg) => {
          if (!calendarInstance.current) return;
          const currentDate = calendarInstance.current.getDate();
          const currentMonth = `${currentDate.getFullYear()}-${
            String(currentDate.getMonth() + 1).padStart(2, "0")
          }`;
          const evts = await fetchMonthAttendance(currentMonth);
          calendarInstance.current.removeAllEvents();
          evts.forEach((evt) => {
            try {
              calendarInstance.current!.addEvent(evt);
            } catch (error) {
              console.error("Error adding event:", evt, error);
            }
          });
        },
      });
      calendar.render();
      calendarInstance.current = calendar;
    })();

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, []);

  return (
    <div class="px-2 sm:px-4 md:px-6 lg:px-8 w-full">
      <div
        ref={calendarRef}
        class="bg-white shadow-lg mx-auto p-1 sm:p-2 md:p-4 rounded w-full max-w-4xl"
      />
    </div>
  );
}
