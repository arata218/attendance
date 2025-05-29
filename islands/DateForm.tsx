import { useState } from "preact/hooks";

// 仮のメンバー一覧
const members = [
  "山田 太郎",
  "佐藤 花子",
  "鈴木 次郎",
  "田中 美咲",
  "高橋 健一",
];

export default function DateForm({ dateStr }: { dateStr: string }) {
  // 各メンバーの出欠状態を管理
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m, ""])),
  );
  // 各メンバーの遅刻時刻を管理
  const [lateTimes, setLateTimes] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m, ""])),
  );
  // 各メンバーの早退時刻を管理
  const [leaveTimes, setLeaveTimes] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m, ""])),
  );

  // 遅刻・早退時刻の選択肢（20:00〜21:30を30分刻み）
  const timeOptions = ["20:00", "20:30", "21:00", "21:30"];

  const handleChange = (member: string, value: string) => {
    setAttendance((prev) => ({ ...prev, [member]: value }));
    // 遅刻以外を選んだら遅刻時刻をリセット
    if (value !== "遅刻") {
      setLateTimes((prev) => ({ ...prev, [member]: "" }));
    }
    // 出席以外を選んだら早退時刻をリセット
    if (value !== "出席") {
      setLeaveTimes((prev) => ({ ...prev, [member]: "" }));
    }
  };

  const handleTimeChange = (member: string, value: string) => {
    setLateTimes((prev) => ({ ...prev, [member]: value }));
  };

  const handleLeaveTimeChange = (member: string, value: string) => {
    setLeaveTimes((prev) => ({ ...prev, [member]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // 出欠情報・遅刻時刻・早退時刻をまとめて送信
    const attendanceWithTime = Object.fromEntries(
      members.map((m) => {
        if (attendance[m] === "遅刻") {
          return [m, { status: "遅刻", time: lateTimes[m] }];
        } else if (attendance[m] === "出席") {
          return [
            m,
            leaveTimes[m] ? { status: "出席", leave: leaveTimes[m] } : "出席",
          ];
        } else {
          return [m, attendance[m]];
        }
      }),
    );
    const attendanceParam = encodeURIComponent(
      JSON.stringify(attendanceWithTime),
    );
    globalThis.location.href = `/?dateStr=${
      encodeURIComponent(dateStr)
    }&attendance=${attendanceParam}`;
  };

  return (
    <form class="flex flex-col items-center gap-6" onSubmit={handleSubmit}>
      <table class="bg-white shadow rounded border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border">団員名</th>
            <th class="px-4 py-2 border">出席</th>
            <th class="px-4 py-2 border">早退時刻</th>
            <th class="px-4 py-2 border">遅刻</th>
            <th class="px-4 py-2 border">出席可能時刻</th>
            <th class="px-4 py-2 border">欠席</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member}>
              <td class="px-4 py-2 border text-lg">{member}</td>
              <td class="px-4 py-2 border text-center">
                <input
                  type="radio"
                  name={member}
                  value="出席"
                  checked={attendance[member] === "出席"}
                  onChange={() => handleChange(member, "出席")}
                  class="w-5 h-5"
                />
              </td>
              <td class="px-4 py-2 border text-center">
                <select
                  value={leaveTimes[member]}
                  onChange={(e) =>
                    handleLeaveTimeChange(
                      member,
                      (e.target as HTMLSelectElement).value,
                    )}
                  disabled={attendance[member] !== "出席"}
                  class={
                    `px-2 py-1 border rounded w-32 text-base transition-colors ` +
                    (attendance[member] !== "出席" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-black")
                  }
                >
                  <option value="">なし</option>
                  {timeOptions.map((t) => <option value={t} key={t}>{t}</option>)}
                </select>
              </td>
              <td class="px-4 py-2 border text-center">
                <input
                  type="radio"
                  name={member}
                  value="遅刻"
                  checked={attendance[member] === "遅刻"}
                  onChange={() => handleChange(member, "遅刻")}
                  class="w-5 h-5"
                />
              </td>
              <td class="px-4 py-2 border text-center">
                <select
                  value={lateTimes[member]}
                  onChange={(e) =>
                    handleTimeChange(
                      member,
                      (e.target as HTMLSelectElement).value,
                    )}
                  disabled={attendance[member] !== "遅刻"}
                  class={
                    `px-2 py-1 border rounded w-32 text-base transition-colors ` +
                    (attendance[member] !== "遅刻" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-black")
                  }
                >
                  <option value="">未入力</option>
                  {timeOptions.map((t) => <option value={t} key={t}>{t}</option>)}
                </select>
              </td>
              <td class="px-4 py-2 border text-center">
                <input
                  type="radio"
                  name={member}
                  value="欠席"
                  checked={attendance[member] === "欠席"}
                  onChange={() => handleChange(member, "欠席")}
                  class="w-5 h-5"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 px-6 py-2 rounded text-white text-lg"
      >
        入力決定
      </button>
    </form>
  );
}
