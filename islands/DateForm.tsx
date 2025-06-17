import { useState } from "preact/hooks";
import NavButtons from "../components/NavButtons.tsx";
import { members } from "../lib/members.ts";
import { timeOptions } from "../lib/timeOptions.ts";
import type { AttendanceValue } from "./Calendar.tsx";

export default function DateForm(
  { dateStr, versionstamp, attendance, error }: {
    dateStr: string;
    versionstamp: string;
    attendance: Record<string, AttendanceValue>;
    error?: string | null;
  },
) {
  const [status, setStatus] = useState<Record<string, string>>(
    Object.fromEntries(
      members.map((m) => [m.id, attendance?.[m.id]?.status ?? ""]),
    ),
  );
  const [time, setTime] = useState<Record<string, string>>(
    Object.fromEntries(
      members.map((m) => [m.id, attendance?.[m.id]?.time ?? ""]),
    ),
  );

  const handleChange = (member: string, value: string) => {
    setStatus((prev) => ({ ...prev, [member]: value }));
    // ラジオボタン変更時は時刻入力もリセット
    setTime((prev) => ({ ...prev, [member]: "" }));
  };
  const handleTimeChange = (member: string, value: string) => {
    setTime((prev) => ({ ...prev, [member]: value }));
  };

  // セレクトボックスの色クラスを条件で返す関数
  const getSelectColor = (status: string, time: string) => {
    if (status !== "出席" && status !== "遅刻") {
      return "bg-gray-100 text-gray-400 cursor-not-allowed";
    }
    if (status === "出席" && time && time !== "" && time !== "早退なし") {
      return "bg-blue-100 text-black";
    }
    if (status === "遅刻" && time && time !== "" && time !== "未入力") {
      return "bg-red-100 text-black";
    }
    return "bg-white text-black";
  };

  return (
    <form
      method="POST"
      class="flex flex-col items-center gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 w-full"
    >
      {error && (
        <div class="mb-2 font-bold text-red-600 text-center">{error}</div>
      )}
      <input type="hidden" name="dateStr" value={dateStr} />
      <input type="hidden" name="versionstamp" value={versionstamp} />
      <input
        type="hidden"
        name="value"
        value={JSON.stringify(Object.fromEntries(
          members.map((m) => [
            m.id,
            time[m.id]
              ? { status: status[m.id], time: time[m.id] }
              : { status: status[m.id] },
          ]),
        ))}
      />
      <div class="mx-auto w-full max-w-3xl">
        <NavButtons dateStr={dateStr} />
      </div>
      <div class="mx-auto w-full max-w-3xl">
        <table class="bg-white shadow rounded w-full min-w-[320px] border-collapse">
          <thead>
            <tr>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border w-[27%] text-xs sm:text-sm md:text-base">
                団員名
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border w-[16%] text-xs sm:text-sm md:text-base">
                役職
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border w-[10%] text-xs sm:text-sm md:text-base">
                出席
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border w-[10%] text-xs sm:text-sm md:text-base">
                遅刻
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border w-[10%] text-xs sm:text-sm md:text-base">
                欠席
              </th>
              <th class="px-1 sm:px-2 py-1 sm:py-2 border w-[27%] text-xs sm:text-sm md:text-base">
                遅刻/早退時刻
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-sm sm:text-base md:text-lg">
                  {member.name}
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-xs sm:text-sm md:text-base text-center">
                  {member.role ?? "団員"}
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <input
                    type="radio"
                    name={member.id}
                    value="出席"
                    checked={status[member.id] === "出席"}
                    onChange={() => handleChange(member.id, "出席")}
                    class="size-3 sm:size-4 md:size-5"
                  />
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <input
                    type="radio"
                    name={member.id}
                    value="遅刻"
                    checked={status[member.id] === "遅刻"}
                    onChange={() => handleChange(member.id, "遅刻")}
                    class="size-3 sm:size-4 md:size-5"
                  />
                </td>
                <td class="px-1 sm:px-2 py-1 sm:py-2 border text-center">
                  <input
                    type="radio"
                    name={member.id}
                    value="欠席"
                    checked={status[member.id] === "欠席"}
                    onChange={() => handleChange(member.id, "欠席")}
                    class="size-3 sm:size-4 md:size-5"
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
                    class={`px-1 sm:px-2 py-1 border rounded w-20 sm:w-24 md:w-28 text-xs sm:text-sm md:text-base transition-colors ${
                      getSelectColor(status[member.id], time[member.id])
                    }`}
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
      <div class="mx-auto w-full max-w-3xl">
        <NavButtons dateStr={dateStr} />
      </div>
    </form>
  );
}
