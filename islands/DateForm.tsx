import { useState } from "preact/hooks";
import NavButtons from "../components/NavButtons.tsx";

type Member = {
  id: string;
  name: string;
  role?: "分団長" | "副分団長" | "班長";
};
// 仮のメンバー一覧
const members: Member[] = [
  { id: "21-02", name: "田中 美咲", role: "分団長" },
  { id: "22-02", name: "中村 直樹", role: "副分団長" },
  { id: "20-02", name: "佐藤 花子", role: "班長" },
  { id: "23-01", name: "小林 未来", role: "班長" },
  { id: "24-01", name: "渡辺 さくら", role: "班長" },
  { id: "20-01", name: "山田 太郎" },
  { id: "21-01", name: "鈴木 次郎" },
  { id: "22-01", name: "高橋 健一" },
  { id: "23-02", name: "加藤 大輔" },
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
  // 各メンバーの遅刻/早退時刻を統一して管理
  const [times, setTimes] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, ""])),
  );

  // 遅刻・早退時刻の選択肢（20:00〜21:30を30分刻み）
  const timeOptions = ["20:00", "20:30", "21:00", "21:30"];

  const handleChange = (member: string, value: string) => {
    setAttendance((prev) => ({ ...prev, [member]: value }));
    // ラジオボタン変更時は時刻入力もリセット
    setTimes((prev) => ({ ...prev, [member]: "" }));
  };

  const handleTimeChange = (member: string, value: string) => {
    setTimes((prev) => ({ ...prev, [member]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // 出欠情報・時刻をまとめて送信
    const attendanceWithTime = Object.fromEntries(
      members.map((m) => {
        if (attendance[m.id] === "遅刻") {
          return [m.id, { status: "遅刻", time: times[m.id] }];
        } else if (attendance[m.id] === "出席") {
          return [
            m.id,
            times[m.id] ? { status: "出席", leave: times[m.id] } : "出席",
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
