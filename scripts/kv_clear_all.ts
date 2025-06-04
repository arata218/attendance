const kv = await Deno.openKv();

let count = 0;

for await (const entry of kv.list({ prefix: [] })) {
  await kv.delete(entry.key);
  console.log("削除:", entry.key);
  count++;
}

console.log(`✅ 合計 ${count} 件のエントリを削除しました`);
