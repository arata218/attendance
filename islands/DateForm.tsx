/// <reference lib="deno.unstable"/>

import { useEffect, useState } from "preact/hooks";
import NavButtons from "../components/NavButtons.tsx";
import { members } from "../lib/members.ts";
import { timeOptions } from "../lib/timeOptions.ts";

type AttendanceValue = { status: string; time?: string } | undefined;

export default function DateForm({ dateStr }: { dateStr: string }) {
  // 各メンバーの出欠状態を管理
  const [status, setStatus] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );
  // 各メンバーの遅刻/早退時刻を統一して管理
  const [time, setTime] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );

  // ページ表示時にデータを取得
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`/api/attendance?dateStr=${dateStr}`);
        if (!res.ok) {
          console.error("Failed to fetch attendance data:", res.statusText);
          return;
        }
        const data: Record<string, AttendanceValue> = await res.json();

        // 取得したデータで状態を更新
        const newStatus: Record<string, string> = {};
        const newTime: Record<string, string> = {};

        members.forEach((member) => {
          const value = data[member.id];
          if (typeof value === "string") {
            newStatus[member.id] = value;
            newTime[member.id] = "";
          } else if (value && typeof value === "object") {
            newStatus[member.id] = value.status;
            newTime[member.id] = value.time || "";
          } else {
            newStatus[member.id] = "";
            newTime[member.id] = "";
          }
        });

        setStatus(newStatus);
        setTime(newTime);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, [dateStr]);

  const handleChange = (member: string, value: string) => {
    setStatus((prev) => ({ ...prev, [member]: value }));
    // ラジオボタン変更時は時刻入力もリセット
    setTime((prev) => ({ ...prev, [member]: "" }));
  };

  const handleTimeChange = (member: string, value: string) => {
    setTime((prev) => ({ ...prev, [member]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // 保存する値の構造: { [id]: { status, time? } }
    const value = Object.fromEntries(
      members.map((m) => [
        m.id,
        time[m.id]
          ? { status: status[m.id], time: time[m.id] }
          : { status: status[m.id] },
      ]),
    );
    // API経由で保存
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateStr, value }),
    });
    if (res.ok) {
      globalThis.location.href = "/";
    } else {
      alert("保存に失敗しました");
    }
  };

  return (
    <form
      class="flex flex-col items-center gap-4 sm:gap-6 w-full px-2 sm:px-4 md:px-6 lg:px-8"
      onSubmit={handleSubmit}
    >
      <div class="w-full max-w-3xl mx-auto">
        <NavButtons dateStr={dateStr} />
      </div>
      <div class="w-full max-w-3xl mx-auto">
        <table class="bg-white shadow rounded border-collapse w-full min-w-[320px]">
          <thead>
            <tr>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base w-[25%]">
                団員名
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base w-[20%]">
                役職
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base w-[10%]">
                出席
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base w-[10%]">
                遅刻
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base w-[10%]">
                欠席
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base w-[25%]">
                遅刻/早退時刻
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base">
                  {member.name}
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center text-xs sm:text-sm md:text-base">
                  {member.role ?? "団員"}
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <input
                    type="radio"
                    name={member.id}
                    value="出席"
                    checked={status[member.id] === "出席"}
                    onChange={() => handleChange(member.id, "出席")}
                    class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <input
                    type="radio"
                    name={member.id}
                    value="遅刻"
                    checked={status[member.id] === "遅刻"}
                    onChange={() => handleChange(member.id, "遅刻")}
                    class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <input
                    type="radio"
                    name={member.id}
                    value="欠席"
                    checked={status[member.id] === "欠席"}
                    onChange={() => handleChange(member.id, "欠席")}
                    class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <select
                    value={status[member.id] === "出席" ||
                        status[member.id] === "遅刻"
                      ? time[member.id]
                      : ""}
                    onChange={(e) => {
                      const value = (e.target as HTMLSelectElement).value;
                      handleTimeChange(member.id, value);
                    }}
                    disabled={status[member.id] !== "出席" &&
                      status[member.id] !== "遅刻"}
                    class={`px-0 sm:px-2 py-1 border rounded w-16 sm:w-20 md:w-24 text-xs sm:text-sm md:text-base transition-colors ` +
                      (status[member.id] !== "出席" &&
                          status[member.id] !== "遅刻"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-black")}
                  >
                    <option value="">
                      {status[member.id] === "出席"
                        ? "早退なし"
                        : status[member.id] === "遅刻"
                        ? "未入力"
                        : "-"}
                    </option>
                    {(status[member.id] === "出席" ||
                      status[member.id] === "遅刻") &&
                      timeOptions.map((t) => (
                        <option value={t} key={t}>{t}</option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div class="w-full max-w-3xl mx-auto">
        <NavButtons dateStr={dateStr} />
      </div>
    </form>
  );
}
