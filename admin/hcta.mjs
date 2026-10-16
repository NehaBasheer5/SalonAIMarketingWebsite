import mysql from 'mysql2/promise';
async function main(){
  const c=await mysql.createConnection({host:'127.0.0.1',port:3306,user:'salon_admin',password:'root123',database:'salon_marketing'});
  const [pages]=await c.query('SELECT id FROM pages WHERE slug=\"home\"');
  const pid=pages[0].id;
  const [secs]=await c.query('SELECT section_key, extra_json, heading, body, cta_label, cta_href FROM page_sections WHERE page_id=? ORDER BY section_key', [pid]);
  secs.forEach(s=>{
    if(s.section_key.includes('cta')){ 
      console.log('===', s.section_key); 
      try{ const j=JSON.parse(s.extra_json||'{}'); console.log(Object.keys(j)); }catch(e){}
    }
  });
  await c.end();
}
main();
