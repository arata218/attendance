export type Member = {
  id: string;
  name: string;
  role?: "分団長" | "副分団長" | "班長";
};

export const members: Member[] = [
  { id: "04-04", name: "村橋 寛", role: "分団長" },
  { id: "03-01", name: "宇佐美 新", role: "副分団長" },
  { id: "06-03", name: "箕浦 祐貴", role: "班長" },
  { id: "05-01", name: "飯沼 龍", role: "班長" },
  { id: "04-01", name: "稲月 将也", role: "班長" },
  { id: "06-01", name: "桑原 和也" },
  { id: "06-02", name: "鳥本 吉寿" },
  { id: "05-02", name: "河合 俊" },
  { id: "05-03", name: "杉山 保仁" },
  { id: "05-04", name: "戸高 恭佑" },
  { id: "05-05", name: "中山 和也" },
  { id: "05-06", name: "眞鍋 周至" },
  { id: "05-07", name: "八木 隆宏" },
  { id: "04-02", name: "河村 達彦" },
  { id: "04-03", name: "柴山 和也" },
  { id: "03-02", name: "堺谷 武司" },
  { id: "03-03", name: "松浦 義弘" },
  { id: "03-04", name: "山川 直哉" },
  { id: "02-01", name: "天野 翔" },
  { id: "02-02", name: "藤原 慶和" },
];
