// Saves completed music-game rounds for signed-in pupils in their own class.
// Each completed round is a separate read-only attempt; weekly bonuses use distinct game types.
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const schoolDB=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const gameT=()=>document.documentElement.lang==='he'?'he':'ru';
const gameText=(ru,he)=>gameT()==='he'?he:ru;
const localDate=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
function currentWeek(d){const day=new Date(d);day.setDate(day.getDate()-day.getDay());return localDate(day)}
let connectedStudent=null;
const connection=(async()=>{
 try{
  const {data:{user},error}=await schoolDB.auth.getUser();
  if(error||!user)return null;
  const {data,error:studentError}=await schoolDB.from('piano_class_students').select('id').eq('student_user_id',user.id).maybeSingle();
  if(studentError)throw studentError;
  connectedStudent=data?.id||null;
  if(connectedStudent){
   const note=document.createElement('p');
   note.className='school-linked-note';
   note.textContent=gameText('Дневник ученика подключён: результаты полных игр сохраняются автоматически.','יומן התלמיד/ה מחובר: תוצאות משחקים מלאים נשמרות אוטומטית.');
   document.querySelector('.hero')?.append(note);
  }
  return connectedStudent;
 }catch(e){console.warn('Piano game connection',e);return null}
})();
function resultNote(finish){
 let node=finish.querySelector('[data-school-sync]');
 if(!node){node=document.createElement('p');node.dataset.schoolSync='';node.className='game-school-status';finish.append(node)}
 return node;
}
async function storeRound(game,finish){
 const studentId=await connection;
 if(!studentId)return;
 const node=resultNote(finish);
 node.textContent=gameText('Сохраняем результат в дневник…','שומרים את התוצאה ביומן…');
 const score=Math.max(0,Math.min(10,Number(document.getElementById(game+'Score')?.textContent)||0));
 const selected=document.querySelector(game==='pitch'?'[data-level].on':'[data-quiz-level].on');
 const level=Number(game==='pitch'?selected?.dataset.level:selected?.dataset.quizLevel)||1;
 const now=new Date();
 const record={student_id:studentId,game,level,score,total:10,played_on:localDate(now),week_start:currentWeek(now)};
 try{
  const {error}=await schoolDB.from('piano_class_game_results').insert(record);
  if(error)throw error;
  node.replaceChildren();
  node.append(document.createTextNode(gameText('✓ Результат '+score+'/10 сохранён в дневнике. ','✓ התוצאה '+score+'/10 נשמרה ביומן. ')));
  const link=document.createElement('a');
  link.href='/piano-school.html?lang='+gameT();
  link.textContent=gameText('Открыть дневник →','פתיחת היומן ←');
  node.append(link);
 }catch(e){
  node.replaceChildren();
  node.append(document.createTextNode(gameText('Не удалось сохранить результат. ','שמירת התוצאה נכשלה. ')));
  const retry=document.createElement('button');
  retry.type='button';
  retry.className='game-sync-retry';
  retry.textContent=gameText('Повторить','ניסיון נוסף');
  retry.onclick=()=>storeRound(game,finish);
  node.append(retry);
  console.error('Piano result sync',e);
 }
}
for(const game of ['pitch','quiz']){
 const finish=document.getElementById(game+'Finish');
 if(!finish)continue;
 const check=()=>{
  if(finish.classList.contains('hidden')){finish.dataset.syncedRound='';return}
  if(finish.dataset.syncedRound)return;
  if(!finish.textContent.includes('/10'))return;
  finish.dataset.syncedRound='1';
  storeRound(game,finish);
 };
 new MutationObserver(check).observe(finish,{attributes:true,attributeFilter:['class'],childList:true});
 check();
}
