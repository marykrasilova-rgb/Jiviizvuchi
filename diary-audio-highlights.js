import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');
const currentPeriod=()=>document.getElementById('periodMonth')?.classList.contains('on')?'month':'week';
function range(period){const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const start=new Date(day+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-(period==='month'?29:6));return{start:start.toISOString().slice(0,10),end:day}}
let generation=0,building=false;
async function render(){
 const root=document.getElementById('periodPortrait');if(!root)return;
 const ticket=++generation,period=currentPeriod(),dates=range(period);
 const {data:{user}}=await s.auth.getUser();if(!user||ticket!==generation)return;
 const {data,error}=await s.from('diary_audio_highlights').select('audio_path,period_start,period_end,source_entry_ids').eq('user_id',user.id).eq('period_type',period).eq('period_start',dates.start).eq('period_end',dates.end).eq('status','ready').maybeSingle();
 if(ticket!==generation)return;
 const box=document.createElement('div');box.className='period-section audio-highlight-card';
 const h=document.createElement('h3');h.textContent=period==='month'?'Коллаж месяца':'Коллаж недели';
 const meta=document.createElement('div');meta.className='small';meta.textContent=dates.start+' — '+dates.end+' · последние '+(period==='month'?'30':'7')+' дней';
 const status=document.createElement('div');status.className='small';status.setAttribute('aria-live','polite');
 box.append(h,meta,status);
 if(data?.audio_path&&data.source_entry_ids?.length>=2){
  const {data:link}=await s.storage.from('voice-recordings').createSignedUrl(data.audio_path,1800);
  if(ticket!==generation)return;
  if(link?.signedUrl){const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=link.signedUrl;box.append(audio);status.textContent='Фрагменты из '+data.source_entry_ids.length+' разных записей.'}
 }
 const button=document.createElement('button');button.type='button';button.className='btn secondary';button.disabled=building;
 button.textContent=data?'Обновить коллаж':'Собрать коллаж';
 const hint=document.createElement('p');hint.className='small';hint.textContent='Короткие фрагменты разных записей, с приоритетом разных дней. ★ помогает выбрать запись внутри дня. После новых записей или изменения ★ обнови коллаж.';
 button.onclick=async()=>{
  if(building)return;building=true;button.disabled=true;status.textContent='Собираю фрагменты разных дней…';
  try{
   const {data:{session}}=await s.auth.getSession();if(!session)throw new Error('Сначала войди в дневник.');
   const response=await fetch('/api/diary-audio-montage',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+session.access_token},body:JSON.stringify({period})});
   const result=await response.json();
   if(response.status===422)throw new Error('Для коллажа нужны хотя бы две голосовые записи за этот период. Записи разных дней сделают его разнообразнее.');
   if(!response.ok)throw new Error('Не удалось собрать коллаж. Попробуй ещё раз.');
   building=false;await render();
  }catch(e){status.textContent=e.message}finally{building=false;button.disabled=false}
 };
 if(error)status.textContent='Не удалось загрузить сохранённый коллаж.';
 box.append(button,hint);
 if(ticket!==generation)return;
 root.querySelector('.audio-highlight-card')?.remove();root.prepend(box);
}
const root=document.getElementById('periodPortrait');
if(root)new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&!n.classList.contains('audio-highlight-card'))))render()}).observe(root,{childList:true});
document.getElementById('periodWeek')?.addEventListener('click',()=>setTimeout(render,0));
document.getElementById('periodMonth')?.addEventListener('click',()=>setTimeout(render,0));
s.auth.onAuthStateChange(()=>setTimeout(render,0));setTimeout(render,300);
