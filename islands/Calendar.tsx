import { Calendar, DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef } from "preact/hooks";

type AttendanceValue = string | { status: string; time?: string } | undefined;
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
        const presentCount = Object.values(attendance).filter((v) => {
          if (typeof v === "string") return v === "出席";
          if (v && typeof v === "object") return v.status === "出席";
          return false;
        }).length;

        const lateCount = Object.values(attendance).filter((v) => {
          if (typeof v === "string") return v === "遅刻";
          if (v && typeof v === "object") return v.status === "遅刻";
          return false;
        }).length;

        const absentCount = Object.values(attendance).filter((v) => {
          if (typeof v === "string") return v === "欠席";
          if (v && typeof v === "object") return v.status === "欠席";
          return false;
        }).length;

        const notInputCount = Object.values(attendance).filter((v) => {
          if (typeof v === "string") return v === "";
          if (v && typeof v === "object") return v.status === "";
          return false;
        }).length;

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

    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "today",
      },
      locale: "ja",
      events: [],
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
      datesSet: async (info: DatesSetArg) => {
        // デバッグ用：全ての情報をログ出力
        console.log("datesSet event info:", {
          startStr: info.startStr,
          endStr: info.endStr,
          start: info.start.toISOString(),
          end: info.end.toISOString(),
        });

        if (!calendarInstance.current) return;

        // カレンダーの現在表示されている日付から月を取得
        const currentDate = calendarInstance.current.getDate();
        const currentMonth = `${currentDate.getFullYear()}-${
          String(currentDate.getMonth() + 1).padStart(2, "0")
        }`;
        console.log("Current month from calendar date:", currentMonth);

        const evts = await fetchMonthAttendance(currentMonth);
        console.log("Fetched events for month:", currentMonth, evts);

        calendarInstance.current.removeAllEvents();
        evts.forEach((evt) => {
          try {
            calendarInstance.current!.addEvent(evt);
          } catch (error) {
            console.error("Error adding event:", evt, error);
          }
        });
      },
      dateClick: (info: { dateStr: string }) => {
        globalThis.location.href = `/date/${info.dateStr}`;
      },
    });
    calendar.render();
    calendarInstance.current = calendar;

    // 初期表示月のイベントをfetchしてaddEvent
    fetchMonthAttendance(ym).then((evts) => {
      if (calendarInstance.current) {
        calendarInstance.current.removeAllEvents();
        evts.forEach((evt) => {
          try {
            calendarInstance.current!.addEvent(evt);
          } catch (error) {
            console.error("Error adding event:", evt, error);
          }
        });
      }
    });

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy();
        calendarInstance.current = null;
      }
    };
  }, []);

  return (
    <div class="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      <div
        ref={calendarRef}
        class="bg-white shadow-lg mx-auto p-1 sm:p-2 md:p-4 rounded-lg w-full max-w-4xl"
      />
    </div>
  );
}
