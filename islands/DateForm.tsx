/// <reference lib="deno.unstable"/>

import { useState } from "preact/hooks";
import NavButtons from "../components/NavButtons.tsx";
import { members } from "../lib/member.ts";

export default function DateForm({ dateStr }: { dateStr: string }) {
  // 各メンバーの出欠状態を管理
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );
  // 各メンバーの遅刻/早退時刻を統一して管理
  const [times, setTimes] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );

  // 遅刻・早退時刻の選択肢（20:00〜21:30を30分刻み）
  const timeOptions = [
    "7:00",
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ];

  const handleChange = (member: string, value: string) => {
    setAttendance((prev) => ({ ...prev, [member]: value }));
    // ラジオボタン変更時は時刻入力もリセット
    setTimes((prev) => ({ ...prev, [member]: "" }));
  };

  const handleTimeChange = (member: string, value: string) => {
    setTimes((prev) => ({ ...prev, [member]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // 保存する値の構造: { [id]: { attendance, times? } }
    const value = Object.fromEntries(
      members.map((m) => [
        m.id,
        times[m.id]
          ? { attendance: attendance[m.id], times: times[m.id] }
          : { attendance: attendance[m.id] },
      ]),
    );
    // API経由で保存
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateStr, value }),
    });
    if (res.ok) {
      console.log(dateStr, value);
      // globalThis.location.href = `/?dateStr=${encodeURIComponent(dateStr)}`;
    } else {
      alert("保存に失敗しました");
    }
  };

  return (
    <form
      class="flex flex-col items-center gap-6"
      onSubmit={handleSubmit}
    >
      <NavButtons dateStr={dateStr} />
      <table class="bg-white shadow rounded border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border">団員名</th>
            <th class="px-4 py-2 border">役職</th>
            <th class="px-4 py-2 border">出席</th>
            <th class="px-4 py-2 border">遅刻</th>
            <th class="px-4 py-2 border">欠席</th>
            <th class="px-4 py-2 border">遅刻/早退時刻</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td class="px-4 py-2 border text-lg">{member.name}</td>
              <td class="px-4 py-2 border text-center">
                {member.role ?? "団員"}
              </td>
              <td class="px-4 py-2 border text-center">
                <input
                  type="radio"
                  name={member.id}
                  value="出席"
                  checked={attendance[member.id] === "出席"}
                  onChange={() => handleChange(member.id, "出席")}
                  class="w-5 h-5"
                />
              </td>
              <td class="px-4 py-2 border text-center">
                <input
                  type="radio"
                  name={member.id}
                  value="遅刻"
                  checked={attendance[member.id] === "遅刻"}
                  onChange={() => handleChange(member.id, "遅刻")}
                  class="w-5 h-5"
                />
              </td>
              <td class="px-4 py-2 border text-center">
                <input
                  type="radio"
                  name={member.id}
                  value="欠席"
                  checked={attendance[member.id] === "欠席"}
                  onChange={() => handleChange(member.id, "欠席")}
                  class="w-5 h-5"
                />
              </td>
              <td class="px-4 py-2 border text-center">
                {/* 早退/出席可能時刻欄: 出席時は早退時刻, 遅刻時は出席可能時刻, それ以外はdisabled */}
                <select
                  value={attendance[member.id] === "出席" ||
                      attendance[member.id] === "遅刻"
                    ? times[member.id]
                    : ""}
                  onChange={(e) => {
                    const value = (e.target as HTMLSelectElement).value;
                    handleTimeChange(member.id, value);
                  }}
                  disabled={attendance[member.id] !== "出席" &&
                    attendance[member.id] !== "遅刻"}
                  class={`px-2 py-1 border rounded w-32 text-base transition-colors ` +
                    (attendance[member.id] !== "出席" &&
                        attendance[member.id] !== "遅刻"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-black")}
                >
                  <option value="">
                    {attendance[member.id] === "出席"
                      ? "早退なし"
                      : attendance[member.id] === "遅刻"
                      ? "未入力"
                      : "-"}
                  </option>
                  {(attendance[member.id] === "出席" ||
                    attendance[member.id] === "遅刻") &&
                    timeOptions.map((t) => (
                      <option value={t} key={t}>{t}</option>
                    ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <NavButtons dateStr={dateStr} />
    </form>
  );
}
