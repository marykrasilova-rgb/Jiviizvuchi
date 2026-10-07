import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const s=createClient(
  'https://uecdlqlwsrqmocbpgiwj.supabase.co',
  'sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb',
  {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
);
const $=id=>document.getElementById(id);
let user=null,recorder=null,stream=null,timerId=null,seconds=0,recordDuration=0,recordBlob=null,previewUrl=null,replyTo=null,feed=[],feedIndex=0;
const signedCache=new Map();

function setView(name){
  ['sound','listen','mine'].forEach(v=>$(v+'View').classList.toggle('hidden',v!==name));
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.view===name));
  if(name==='listen')loadFeed();
  if(name==='mine')loadMine();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>setView(b.dataset.view));

async function logEvent(name,metadata={}){
  if(!user)return;
  try{await s.from('usage_events').insert({user_id:user.id,event_name:name,modality:'voice',metadata})}catch{}
}

async function authState(){
  const {data:{user:u}}=await s.auth.getUser();
  user=u||null;
  $('authView').classList.toggle('hidden',!!user);
  $('appView').classList.toggle('hidden',!user);
  $('logoutBtn').classList.toggle('hidden',!user);
  if(user){
    $('authorLabel').value=localStorage.getItem('echo_author_label')||'';
    await logEvent('echo_open');
    loadFeed();
  }
}
$('loginBtn').onclick=async()=>{
  $('authMsg').textContent='';
  const email=$('email').value.trim(),password=$('password').value;
  if(!email||!password){$('authMsg').textContent='Введите email и пароль.';return}
  $('loginBtn').disabled=true;
  const {error}=await s.auth.signInWithPassword({email,password});
  $('loginBtn').disabled=false;
  $('authMsg').textContent=error?error.message:'';
  if(!error)authState();
};
$('logoutBtn').onclick=async()=>{await s.auth.signOut();location.reload()};
s.auth.onAuthStateChange(()=>setTimeout(authState,0));
authState();

function bestMime(){
  const types=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus','audio/aac'];
  return types.find(t=>window.MediaRecorder?.isTypeSupported?.(t))||'';
}
function formatTime(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function clearRecording(){
  if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}
  recordBlob=null;recordDuration=0;$('preview').removeAttribute('src');$('preview').classList.add('hidden');$('timer').textContent='00:00';$('recordStatus').textContent='Максимум 60 секунд';$('recordBtn').classList.remove('recording');$('recordBtn').innerHTML='🎙<br>Начать';$('publishBtn').disabled=true;
}
async function startRecording(){
  try{
    clearRecording();
    stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const chunks=[],mime=bestMime();
    recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);
    seconds=0;$('timer').textContent='00:00';
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    recorder.onstop=()=>{
      clearInterval(timerId);
      stream?.getTracks().forEach(t=>t.stop());
      recordDuration=Math.max(1,seconds);
      recordBlob=new Blob(chunks,{type:recorder.mimeType||chunks[0]?.type||'audio/webm'});
      previewUrl=URL.createObjectURL(recordBlob);
      $('preview').src=previewUrl;$('preview').classList.remove('hidden');
      $('recordBtn').classList.remove('recording');$('recordBtn').innerHTML='🎙<br>Записать заново';
      $('recordStatus').textContent='Запись готова. Можно прослушать перед публикацией.';
      $('publishBtn').disabled=!$('publishConsent').checked;
    };
    recorder.start();
    $('recordBtn').classList.add('recording');$('recordBtn').innerHTML='■<br>Остановить';$('recordStatus').textContent='Идёт запись';
    await logEvent('echo_record_start',{reply:!!replyTo});
    timerId=setInterval(()=>{
      seconds++;$('timer').textContent=formatTime(seconds);
      if(seconds>=60&&recorder?.state==='recording')recorder.stop();
    },1000);
  }catch(e){$('recordStatus').textContent='Не удалось включить микрофон. Проверь разрешение браузера.'}
}
$('recordBtn').onclick=()=>recorder?.state==='recording'?recorder.stop():startRecording();
$('publishConsent').onchange=()=>{$('publishBtn').disabled=!(recordBlob&&$('publishConsent').checked)};

function extFor(type){
  if(type.includes('mp4')||type.includes('m4a'))return 'm4a';
  if(type.includes('ogg'))return 'ogg';
  if(type.includes('mpeg'))return 'mp3';
  if(type.includes('aac'))return 'aac';
  return 'webm';
}
$('authorLabel').onchange=()=>localStorage.setItem('echo_author_label',$('authorLabel').value.trim());

$('publishBtn').onclick=async()=>{
  if(!user||!recordBlob||!$('publishConsent').checked)return;
  $('publishBtn').disabled=true;$('publishStatus').textContent='Отправляю…';
  const path=user.id+'/'+Date.now()+'-'+crypto.randomUUID()+'.'+extFor(recordBlob.type);
  const {error:upErr}=await s.storage.from('echo-audio').upload(path,recordBlob,{contentType:recordBlob.type||'audio/webm',upsert:false});
  if(upErr){$('publishStatus').textContent='Не удалось загрузить запись: '+upErr.message;$('publishBtn').disabled=false;return}
  const label=$('authorLabel').value.trim().slice(0,40)||'Анонимный голос';
  localStorage.setItem('echo_author_label',$('authorLabel').value.trim());
  const {error:dbErr}=await s.from('echo_posts').insert({
    user_id:user.id,parent_id:replyTo?.id||null,author_label:label,
    prompt:replyTo?'Ответ на голос':'Как ты звучишь сегодня?',
    audio_path:path,duration_seconds:recordDuration,consent_public:true,is_published:true
  });
  if(dbErr){
    await s.storage.from('echo-audio').remove([path]);
    $('publishStatus').textContent='Не удалось опубликовать запись: '+dbErr.message;$('publishBtn').disabled=false;return
  }
  await logEvent(replyTo?'echo_reply_publish':'echo_publish',{duration_sec:recordDuration,reply:!!replyTo});
  $('publishStatus').textContent=replyTo?'Ответ отправлен.':'Голос отправлен в Эхо.';
  clearRecording();$('publishConsent').checked=false;replyTo=null;renderReplyBanner();
  await Promise.all([loadFeed(),loadMine()]);
  setTimeout(()=>setView('listen'),350);
};

function renderReplyBanner(){
  $('replyBanner').classList.toggle('hidden',!replyTo);
  $('replyWho').textContent=replyTo?'Ответ для: '+replyTo.author_label:'';
}
$('cancelReply').onclick=()=>{replyTo=null;renderReplyBanner()};

async function signedUrl(path){
  if(signedCache.has(path))return signedCache.get(path);
  const {data,error}=await s.storage.from('echo-audio').createSignedUrl(path,3600);
  if(error)return '';
  signedCache.set(path,data.signedUrl);return data.signedUrl;
}
function shuffled(a){
  const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b;
}
function dateText(value){
  try{return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value))}catch{return ''}
}
async function loadFeed(){
  if(!user)return;
  const [{data:posts,error},{data:reports}]=await Promise.all([
    s.from('echo_posts').select('id,user_id,parent_id,author_label,prompt,audio_path,duration_seconds,created_at').eq('is_published',true).eq('consent_public',true).order('created_at',{ascending:false}).limit(80),
    s.from('echo_reports').select('post_id').eq('reporter_user_id',user.id)
  ]);
  if(error){$('feedHost').innerHTML='<div class="card empty">Не удалось загрузить поток.</div>';return}
  const blocked=new Set((reports||[]).map(r=>r.post_id));
  feed=shuffled((posts||[]).filter(p=>!blocked.has(p.id)));
  feedIndex=0;renderFeed();
}
async function renderFeed(){
  const host=$('feedHost');host.replaceChildren();
  if(!feed.length){
    const e=document.createElement('div');e.className='card empty';e.textContent='Пока здесь тихо. Оставь первый голос — и у другого человека появится возможность ответить.';host.appendChild(e);return
  }
  if(feedIndex>=feed.length)feedIndex=0;
  const post=feed[feedIndex],card=document.createElement('div');card.className='card feed-card';
  const meta=document.createElement('div');meta.className='feed-meta';
  const who=document.createElement('div');who.className='who';
  const av=document.createElement('div');av.className='avatar';av.textContent='♪';
  const names=document.createElement('div');const author=document.createElement('div');author.className='author';author.textContent=post.author_label+(post.user_id===user.id?' · это ты':'');
  const when=document.createElement('div');when.className='small';when.textContent=dateText(post.created_at);
  names.append(author,when);who.append(av,names);
  const count=document.createElement('span');count.className='count';count.textContent=post.parent_id?'↗ ответ':'первый импульс';
  meta.append(who,count);
  const prompt=document.createElement('div');prompt.className='prompt';prompt.textContent=post.prompt||'Звуковой импульс';
  const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=await signedUrl(post.audio_path);
  audio.onplay=()=>logEvent('echo_listen',{own:post.user_id===user.id});
  const actions=document.createElement('div');actions.className='actions';
  const reply=document.createElement('button');reply.className='btn';reply.textContent='Ответить звуком';reply.onclick=()=>{replyTo=post;renderReplyBanner();setView('sound')};
  const next=document.createElement('button');next.className='btn secondary';next.textContent='Следующее звучание';next.onclick=()=>{feedIndex=(feedIndex+1)%feed.length;renderFeed()};
  actions.append(reply,next);
  const minor=document.createElement('div');minor.className='minor';
  const info=document.createElement('span');info.className='small';info.textContent=post.duration_seconds+' сек';
  minor.appendChild(info);
  if(post.user_id!==user.id){
    const report=document.createElement('button');report.type='button';report.textContent='Скрыть / пожаловаться';report.onclick=()=>reportPost(post.id);minor.appendChild(report);
  }
  card.append(meta,prompt,audio,actions,minor);host.appendChild(card);
}
async function reportPost(id){
  if(!confirm('Скрыть эту запись из твоего потока и отправить отметку администратору?'))return;
  const {error}=await s.from('echo_reports').insert({reporter_user_id:user.id,post_id:id,reason:'other'});
  if(error){alert('Не удалось отправить отметку.');return}
  feed=feed.filter(p=>p.id!==id);feedIndex=0;renderFeed();await logEvent('echo_report');
}

async function loadMine(){
  if(!user)return;
  const {data,error}=await s.from('echo_posts').select('id,parent_id,author_label,prompt,audio_path,duration_seconds,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50);
  const host=$('mineHost');host.replaceChildren();
  if(error){host.textContent='Не удалось загрузить записи.';return}
  if(!data?.length){const e=document.createElement('div');e.className='empty';e.textContent='Ты ещё ничего не отправляла в Эхо.';host.appendChild(e);return}
  for(const p of data){
    const item=document.createElement('div');item.className='mine-item';
    const head=document.createElement('div');head.className='mine-head';
    const left=document.createElement('div');const strong=document.createElement('strong');strong.textContent=p.parent_id?'Ответ голосом':'Звуковой импульс';const when=document.createElement('div');when.className='small';when.textContent=dateText(p.created_at);left.append(strong,when);
    const del=document.createElement('button');del.className='delete';del.type='button';del.textContent='Удалить';del.onclick=()=>deletePost(p);
    head.append(left,del);
    const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=await signedUrl(p.audio_path);
    item.append(head,audio);host.appendChild(item);
  }
}
async function deletePost(p){
  if(!confirm('Удалить эту публикацию из Эха?'))return;
  const {error}=await s.from('echo_posts').delete().eq('id',p.id).eq('user_id',user.id);
  if(error){alert('Не удалось удалить публикацию.');return}
  await s.storage.from('echo-audio').remove([p.audio_path]);
  signedCache.delete(p.audio_path);await logEvent('echo_delete');await Promise.all([loadMine(),loadFeed()]);
}
