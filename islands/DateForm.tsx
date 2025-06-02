import { useState } from "preact/hooks";

type Member = {
  id: string;
  name: string;
  role?: "分団長" | "副分団長" | "班長";
};
// 仮のメンバー一覧
const members: Member[] = [
  { id: "20-01", name: "山田 太郎" },
  { id: "20-02", name: "佐藤 花子", role: "班長" },
  { id: "21-01", name: "鈴木 次郎" },
  { id: "21-02", name: "田中 美咲", role: "分団長" },
  { id: "22-01", name: "高橋 健一" },
  { id: "22-02", name: "中村 直樹", role: "副分団長" },
  { id: "23-01", name: "小林 未来", role: "班長" },
  { id: "23-02", name: "加藤 大輔" },
  { id: "24-01", name: "渡辺 さくら", role: "班長" },
  { id: "24-02", name: "斎藤 拓也" },
  { id: "25-01", name: "伊藤 亮介" },
  { id: "25-02", name: "森本 さやか" },
  { id: "25-03", name: "大西 翔太" },
  { id: "25-04", name: "三浦 ひかり" },
  { id: "25-05", name: "石田 直人" },
  { id: "26-01", name: "藤井 みなみ" },
  { id: "26-02", name: "松田 健太" },
  { id: "26-03", name: "岡本 さとし" },
  { id: "26-04", name: "柴田 まゆ" },
  { id: "26-05", name: "西村 たけし" },
];

export default function DateForm({ dateStr }: { dateStr: string }) {
  // 各メンバーの出欠状態を管理
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );
  // 各メンバーの遅刻時刻を管理
  const [lateTimes, setLateTimes] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );
  // 各メンバーの早退時刻を管理
  const [leaveTimes, setLeaveTimes] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
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
        if (attendance[m.id] === "遅刻") {
          return [m.id, { status: "遅刻", time: lateTimes[m.id] }];
        } else if (attendance[m.id] === "出席") {
          return [
            m.id,
            leaveTimes[m.id]
              ? { status: "出席", leave: leaveTimes[m.id] }
              : "出席",
          ];
        } else {
          return [m.id, attendance[m.id]];
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

  // ソート: 分団長→副分団長→班長→団員
  const roleOrder = { "分団長": 0, "副分団長": 1, "班長": 2 };
  const sortedMembers = [...members].sort((a, b) => {
    const aOrder = a.role ? roleOrder[a.role] ?? 3 : 3;
    const bOrder = b.role ? roleOrder[b.role] ?? 3 : 3;
    if (aOrder !== bOrder) return aOrder - bOrder;
    // 班長同士もid順、団員同士もid順
    if ((aOrder === 2 && bOrder === 2) || (aOrder === 3 && bOrder === 3)) {
      return a.id.localeCompare(b.id, "ja");
    }
    return a.name.localeCompare(b.name, "ja");
  });

  return (
    <form class="flex flex-col items-center gap-6" onSubmit={handleSubmit}>
      <table class="bg-white shadow rounded border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 border">団員名</th>
            <th class="px-4 py-2 border">役職</th>
            <th class="px-4 py-2 border">出席</th>
            <th class="px-4 py-2 border">早退時刻</th>
            <th class="px-4 py-2 border">遅刻</th>
            <th class="px-4 py-2 border">出席可能時刻</th>
            <th class="px-4 py-2 border">欠席</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.map((member) => (
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
                <select
                  value={leaveTimes[member.id]}
                  onChange={(e) =>
                    handleLeaveTimeChange(
                      member.id,
                      (e.target as HTMLSelectElement).value,
                    )}
                  disabled={attendance[member.id] !== "出席"}
                  class={`px-2 py-1 border rounded w-32 text-base transition-colors ` +
                    (attendance[member.id] !== "出席"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-black")}
                >
                  <option value="">なし</option>
                  {timeOptions.map((t) => <option value={t} key={t}>{t}
                  </option>)}
                </select>
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
                <select
                  value={lateTimes[member.id]}
                  onChange={(e) =>
                    handleTimeChange(
                      member.id,
                      (e.target as HTMLSelectElement).value,
                    )}
                  disabled={attendance[member.id] !== "遅刻"}
                  class={`px-2 py-1 border rounded w-32 text-base transition-colors ` +
                    (attendance[member.id] !== "遅刻"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-black")}
                >
                  <option value="">未入力</option>
                  {timeOptions.map((t) => <option value={t} key={t}>{t}
                  </option>)}
                </select>
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
