import mysql from 'mysql2/promise';
async function main(){
  const c=await mysql.createConnection({host:'127.0.0.1',port:3306,user:'salon_admin',password:'root123',database:'salon_marketing'});
  const [pages]=await c.query('SELECT id FROM pages WHERE slug=\"home\"');
  const pid=pages[0].id;
  const [secs]=await c.query('SELECT section_key, extra_json, image_url, video_url FROM page_sections WHERE page_id=? AND section_key=\"cta_banner\"', [pid]);
  if(secs[0]){ const j=JSON.parse(secs[0].extra_json||'{}'); console.log(JSON.stringify(j)); console.log(secs[0].image_url, secs[0].video_url); }
  await c.end();
}
main();
