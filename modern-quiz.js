// Five listening quizzes built from one hand-curated 100-work canon.
// A question is playable only when the exact recording is available from the
// licensed catalogue. Missing tracks are skipped, never replaced by generic music.
(()=>{
 const GENRES=new Set(['academic','jazz','rock','pop','minimal']);
 const TITLES={
  academic:'Академическая музыка XX–XXI века',
  jazz:'Джаз — великие записи',
  rock:'Рок — великие записи',
  pop:'Поп — великие записи',
  minimal:'Минимализм и постминимализм'
 };
 let genre='',candidates=[],round=0,score=0,current=null,audio=null,stopTimer=null;
 let startedAt=0,userId='',loading=false,sessionToken=0;
 const $=id=>document.getElementById(id);
 const shuffle=a=>[...a].sort(()=>Math.random()-.5);
 const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

 function getUserId(){
  let id=localStorage.getItem('mariaMusicLicensedUser');
  if(!id){id=(crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`);localStorage.setItem('mariaMusicLicensedUser',id)}
  return id;
 }
 function bank(){return window.LICENSED_MUSIC_CANONS?.[genre]||[]}
 function stop(){
  if(stopTimer)clearTimeout(stopTimer);stopTimer=null;
  if(audio){try{audio.pause();audio.currentTime=0}catch(e){}audio=null}
 }
 function report(track,seconds){
  if(!track?.trackId||!userId)return;
  fetch('/api/music-preview-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({trackId:track.trackId,userId,seconds})}).catch(()=>{});
 }
 async function resolveTrack(track){
  if(track.preview)return track;
  const u=`/api/music-preview?artist=${encodeURIComponent(track.artist)}&work=${encodeURIComponent(track.work)}&kind=${encodeURIComponent(track.kind||'artist')}`;
  const r=await fetch(u,{cache:'no-store'});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw Object.assign(new Error(j.error||'preview unavailable'),{status:r.status,configured:j.configured});
  track.preview=j.audioUrl;track.trackId=j.trackId;track.country=j.country;track.provider=j.provider;
  return track;
 }
 async function photo(title){
  try{const r=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title));if(!r.ok)return '';const j=await r.json();return j.thumbnail?.source||''}catch(e){return ''}
 }
 async function fillPhotos(token){
  const cards=[...document.querySelectorAll('#modernAnswers [data-photo]')];
  await Promise.all(cards.map(async card=>{const src=await photo(card.dataset.photo);if(token!==sessionToken||!src)return;const image=card.querySelector('img');if(image){image.src=src;image.hidden=false}card.querySelector('.artist-placeholder')?.remove()}));
 }
 function answerPool(){
  const seen=new Set();
  return bank().filter(track=>!seen.has(track.artist)&&seen.add(track.artist));
 }
 function setListen(enabled,label){
  const button=$('modernListen');if(!button)return;
  button.disabled=!enabled;button.setAttribute('aria-disabled',String(!enabled));button.classList.toggle('is-loading',loading);
  const span=button.querySelector('span');if(span)span.textContent=label||'Слушать фрагмент';
 }
 function setCards(enabled){
  $('modernAnswers')?.querySelectorAll('button').forEach(button=>{button.disabled=!enabled;button.classList.toggle('awaiting-audio',!enabled)});
 }
 function setQuestionCopy(){
  const intro=document.querySelector('#modernQuizPlay > p.muted');
  const prompt=document.querySelector('#modernQuizPlay .play-zone > p');
  if(intro)intro.textContent=genre==='academic'||genre==='minimal'
   ?'Послушай фрагмент шедевра и выбери композитора. В игре нет случайных замен и стилизаций.'
   :'Послушай фрагмент великой записи и выбери исполнителя. В игре нет случайных замен и каверов.';
  if(prompt)prompt.textContent=genre==='academic'||genre==='minimal'?'Кто написал эту музыку?':'Кто это?';
 }
 function showLoading(){
  loading=true;current=null;stop();setQuestionCopy();
  $('modernRound').textContent=`${Math.min(round+1,10)}/10`;$('modernScore').textContent=score;
  $('modernQuizTitle').textContent=TITLES[genre]||'Угадай музыку';
  $('modernAnswers').innerHTML='';
  $('modernFeedback').innerHTML='<span class="quiz-hint">Подбираю оригинальную запись из канона…</span>';
  setListen(false,'Подключаю оригинал…');
 }
 function showUnavailable(configured){
  loading=false;current=null;setListen(false,'Оригинал недоступен');setCards(false);
  const missingAccess=configured===false;
  const title=missingAccess?'Оригинальные записи временно недоступны.':'Не удалось собрать раунд из оригинальных записей.';
  const detail=missingAccess
   ?'В игре остаются только признанные шедевры. Оригинальные фрагменты появятся после подключения лицензированного каталога — случайной музыкой они не подменяются.'
   :'Если нужной записи нет, сайт не подменяет её похожей или случайной музыкой.';
  const action=missingAccess?'Вернуться к жанрам':'Попробовать снова';
  $('modernFeedback').innerHTML=`<div class="music-unavailable"><b>${title}</b><span>${detail}</span><button type="button" id="retryLicensedAudio" class="secondary">${action}</button></div>`;
  $('retryLicensedAudio')?.addEventListener('click',()=>missingAccess?close():start(genre),{once:true});
 }
 function buildQuestion(track,token){
  if(token!==sessionToken)return;
  loading=false;current=track;
  $('modernRound').textContent=`${round+1}/10`;$('modernScore').textContent=score;
  $('modernQuizTitle').textContent=TITLES[genre]||'Угадай музыку';
  const wrong=shuffle(answerPool().filter(item=>item.artist!==track.artist)).slice(0,3);
  const choices=shuffle([track,...wrong]);
  $('modernAnswers').innerHTML=choices.map(item=>`<button type="button" class="artist-answer-card" data-answer="${esc(item.artist)}" data-photo="${esc(item.wiki||item.artist)}"><span class="artist-photo"><span class="artist-placeholder">♪</span><img hidden alt="${esc(item.artist)}"></span><b>${esc(item.artist)}</b></button>`).join('');
  $('modernAnswers').querySelectorAll('button').forEach(button=>button.addEventListener('click',event=>answer(event.currentTarget,event.currentTarget.dataset.answer)));
  fillPhotos(token);setCards(true);setListen(true,'Слушать фрагмент');
  $('modernFeedback').innerHTML='<span class="quiz-ready">Оригинальная запись готова. Нажми «Слушать фрагмент».</span>';
  const next=candidates[0];if(next&&!next.preview)resolveTrack(next).catch(()=>{});
 }
 async function prepareNext(token){
  if(round>=10||!candidates.length){if(round>0)finish();else showUnavailable();return}
  showLoading();let unavailableBecauseConfig=false;
  while(token===sessionToken&&candidates.length){
   const candidate=candidates.shift();
   try{await resolveTrack(candidate);buildQuestion(candidate,token);return}
   catch(error){if(error.configured===false){unavailableBecauseConfig=true;break}}
  }
  if(token===sessionToken)showUnavailable(unavailableBecauseConfig?false:undefined);
 }
 function play(){
  if(!current?.preview||loading)return;
  stop();audio=new Audio(current.preview);audio.preload='auto';audio.playsInline=true;startedAt=Date.now();
  const promise=audio.play();
  if(promise?.then)promise.then(()=>{
   $('modernFeedback').innerHTML='<span class="quiz-playing">Играет оригинальная запись · до 20 секунд</span>';
   stopTimer=setTimeout(()=>{const track=current;const seconds=Math.min(20,Math.round((Date.now()-startedAt)/1000));stop();report(track,seconds)},20000);
  }).catch(()=>{$('modernFeedback').innerHTML='<span class="quiz-hint">Нажми «Слушать фрагмент» ещё раз — iPhone иногда блокирует первый запуск.</span>'});
 }
 function answer(button,name){
  if(!current||loading)return;
  if(name!==current.artist){button.classList.add('wrong');button.disabled=true;$('modernFeedback').textContent='Не он. Попробуй ещё.';if(typeof recordGameAnswer==='function')recordGameAnswer('modern',false);return}
  const answered=current;const played=audio?Math.min(20,Math.round((Date.now()-startedAt)/1000)):0;stop();if(played)report(answered,played);
  button.classList.add('correct');$('modernAnswers').querySelectorAll('button').forEach(item=>item.disabled=true);score++;$('modernScore').textContent=score;
  const full=window.youtubeMusicSearchUrl?window.youtubeMusicSearchUrl(answered):'';
  $('modernFeedback').innerHTML=`<div class="answer-reveal"><b>Верно!</b><span>${esc(answered.artist)} — ${esc(answered.work)}</span><small>${esc(answered.year)} · ${esc(answered.era)}</small>${full?`<a href="${full}" target="_blank" rel="noopener">Слушать полностью ↗</a>`:''}</div>`;
  if(typeof recordGameAnswer==='function')recordGameAnswer('modern',true);round++;current=null;
  if(round>=10)return setTimeout(finish,900);setTimeout(()=>prepareNext(sessionToken),900);
 }
 function finish(){
  stop();loading=false;$('modernQuizPlay').classList.add('hidden');const finishBox=$('modernFinish');finishBox.classList.remove('hidden');
  finishBox.innerHTML=`<h3>${score}/${round}</h3><p>${score>=8?'Отлично!':score>=5?'Очень хорошо.':'Ещё один раунд — и узнавание станет увереннее.'}</p><button class="primary" id="modernAgain">Сыграть ещё</button>`;
  $('modernAgain').onclick=()=>start(genre);
 }
 function start(key){
  if(!GENRES.has(key))return;sessionToken++;genre=key;round=0;score=0;current=null;loading=false;userId=getUserId();candidates=shuffle(bank().map(track=>({...track})));
  document.getElementById('modernHub')?.classList.add('hidden');$('modernFinish')?.classList.add('hidden');$('modernQuizPlay')?.classList.remove('hidden');
  $('modernScore').textContent='0';prepareNext(sessionToken);window.scrollTo({top:0,behavior:'smooth'});
 }
 function close(){sessionToken++;stop();loading=false;current=null;$('modernQuizPlay')?.classList.add('hidden');$('modernFinish')?.classList.add('hidden');document.getElementById('modernHub')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
 function init(){
  const hub=document.getElementById('modernHub');if(!hub)return;
  const hubIntro=hub.querySelector(':scope > p.muted');
  if(hubIntro)hubIntro.textContent='В каждом жанре — 20 произведений строгого канона, без случайных замен. В раунде 10 вопросов.';
  hub.querySelectorAll('[data-genre]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();start(button.dataset.genre)}));
  $('modernListen')?.addEventListener('click',play);$('modernQuizBack')?.addEventListener('click',close);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
