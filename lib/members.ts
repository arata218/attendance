export type Member = {
  id: string;
  name: string;
  role?: "分団長" | "副分団長" | "班長";
};

export const members: Member[] = [
  { id: "21-02", name: "田中 美咲", role: "分団長" },
  { id: "22-02", name: "中村 直樹", role: "副分団長" },
  { id: "20-02", name: "佐藤 花子", role: "班長" },
  { id: "23-01", name: "小林 未来", role: "班長" },
  { id: "24-01", name: "渡辺 さくらこ", role: "班長" },
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
