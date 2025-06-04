const kv = await Deno.openKv();

let count = 0;

for await (const entry of kv.list({ prefix: [] })) {
  console.log(
    "📦",
    JSON.stringify(entry.key),
    "=>",
    JSON.stringify(entry.value),
  );
  count++;
}

console.log(`✅ 合計 ${count} 件のエントリを表示しました`);
