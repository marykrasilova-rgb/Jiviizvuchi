// Licensed playback runtime for rock, pop and minimalism.
// Uses the server-side MassiveMusic/7digital adapter; no copyrighted audio is stored in this repo.
(()=>{
 const GENRES=new Set(['rock','pop','minimal']);
 const TITLES={rock:'Рок',pop:'Поп',minimal:'Минимализм и постминимализм'};
 let genre='',queue=[],round=0,score=0,current=null,audio=null,stopTimer=null,startedAt=0,userId='',audioReady=false;
 const $=id=>document.getElementById(id),shuffle=a=>[...a].sort(()=>Math.random()-.5);
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 function getUserId(){let id=localStorage.getItem('mariaMusicLicensedUser');if(!id){id=(crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`);localStorage.setItem('mariaMusicLicensedUser',id)}return id}
 function stop(){if(stopTimer)clearTimeout(stopTimer);stopTimer=null;if(audio){try{audio.pause()}catch(e){}audio=null}}
 function report(track,seconds){if(!track?.trackId||!userId)return;fetch('/api/music-preview-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({trackId:track.trackId,userId,seconds})}).catch(()=>{})}
 async function resolve(track){
  if(track.preview)return track;
  const u=`/api/music-preview?artist=${encodeURIComponent(track.artist)}&work=${encodeURIComponent(track.work)}`;
  const r=await fetch(u);const j=await r.json().catch(()=>({}));
  if(!r.ok)throw Object.assign(new Error(j.error||'preview unavailable'),{status:r.status,configured:j.configured});
  track.preview=j.audioUrl;track.trackId=j.trackId;track.country=j.country;track.provider=j.provider;return track;
 }
 async function photo(title){try{const r=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title));const j=await r.json();return j.thumbnail?.source||''}catch(e){return ''}}
 async function fillPhotos(){const cards=[...document.querySelectorAll('#modernAnswers [data-photo]')];await Promise.all(cards.map(async c=>{const src=await photo(c.dataset.photo);if(src){const im=c.querySelector('img');im.src=src;im.hidden=false;c.querySelector('.artist-placeholder')?.remove()}}))}
 function pool(){const bank=window.LICENSED_MUSIC_CANONS?.[genre]||[];const seen=new Set();return bank.filter(x=>!seen.has(x.artist)&&seen.add(x.artist))}
 function setListenState(enabled,label){const b=$('modernListen');if(!b)return;b.disabled=!enabled;b.setAttribute('aria-disabled',String(!enabled));const span=b.querySelector('span');if(span)span.textContent=label||'Слушать фрагмент'}
 function build(){
  current=queue[round];if(!current)return finish();
  audioReady=!!current.preview;
  $('modernRound').textContent=`${round+1}/${queue.length}`;$('modernScore').textContent=score;$('modernQuizTitle').textContent=TITLES[genre];$('modernFeedback').textContent='';
  const wrong=shuffle(pool().filter(x=>x.artist!==current.artist)).slice(0,3),choices=shuffle([current,...wrong]);
  $('modernAnswers').innerHTML=choices.map(x=>`<button type="button" class="artist-answer-card" data-answer="${esc(x.artist)}" data-photo="${esc(x.artist)}"><span class="artist-photo"><span class="artist-placeholder">♪</span><img hidden alt="${esc(x.artist)}"></span><b>${esc(x.artist)}</b></button>`).join('');
  $('modernAnswers').querySelectorAll('button').forEach(b=>b.addEventListener('click',ev=>answer(ev.currentTarget,ev.currentTarget.dataset.answer)));
  fillPhotos();
  setListenState(audioReady,audioReady?'Слушать фрагмент':'Подключаю запись…');
 }
 async function prepareCurrent({autoplay=false}={}){
  if(!current)return;
  try{
   await resolve(current);audioReady=true;setListenState(true,'Слушать фрагмент');$('modernFeedback').textContent='Запись готова.';
   const next=queue[round+1];if(next&&!next.preview)resolve(next).catch(()=>{});
   if(autoplay)play();
  }catch(e){
   audioReady=false;setListenState(false,'Запись пока недоступна');
   $('modernFeedback').innerHTML='<b>Карточки работают, но звук пока не подключён.</b><br>Лицензированный музыкальный каталог ещё не выдал production-доступ. Игра останется здесь — она больше не будет выбрасывать тебя обратно.';
  }
 }
 function play(){
  if(!current?.preview){if(!audioReady)$('modernFeedback').textContent='Запись для этого раунда пока недоступна.';return}
  stop();audio=new Audio(current.preview);audio.preload='auto';audio.playsInline=true;startedAt=Date.now();
  const p=audio.play();if(p?.then)p.then(()=>{$('modernFeedback').textContent='Играет настоящий лицензированный фрагмент · до 20 секунд';stopTimer=setTimeout(()=>{const t=current;const secs=Math.min(20,Math.round((Date.now()-startedAt)/1000));stop();report(t,secs)},20000)}).catch(()=>{$('modernFeedback').textContent='Нажми «Слушать фрагмент» — iPhone блокирует автоматический первый запуск.'});
 }
 function answer(btn,name){
  if(!audioReady){$('modernFeedback').textContent='Сначала нужна доступная запись — я не засчитываю ответ без музыки.';return}
  if(name!==current.artist){btn.classList.add('wrong');btn.disabled=true;$('modernFeedback').textContent='Не он. Попробуй ещё.';if(typeof recordGameAnswer==='function')recordGameAnswer('modern',false);return}
  const played=audio?Math.min(20,Math.round((Date.now()-startedAt)/1000)):0,answered=current;stop();if(played)report(answered,played);
  btn.classList.add('correct');$('modernAnswers').querySelectorAll('button').forEach(b=>b.disabled=true);score++;$('modernScore').textContent=score;
  const yt=window.youtubeMusicSearchUrl?window.youtubeMusicSearchUrl(answered):`https://music.youtube.com/search?q=${encodeURIComponent(answered.artist+' '+answered.work)}`;
  $('modernFeedback').innerHTML=`Верно! <b>${esc(answered.artist)}</b> — ${esc(answered.work)} · ${esc(answered.era||'')}<br><a href="${yt}" target="_blank" rel="noopener">Слушать полностью в YouTube Music ↗</a>`;
  if(typeof recordGameAnswer==='function')recordGameAnswer('modern',true);round++;if(round>=queue.length)return setTimeout(finish,650);setTimeout(()=>{build();prepareCurrent({autoplay:true})},650)
 }
 function finish(){stop();$('modernQuizPlay').classList.add('hidden');const f=$('modernFinish');f.classList.remove('hidden');f.innerHTML=`<h3>${score}/${queue.length}</h3><p>${score>=8?'Отлично!':score>=5?'Очень хорошо.':'Ещё один раунд — и узнавание станет увереннее.'}</p><button class="primary" id="licensedAgain">Сыграть ещё</button>`;$('licensedAgain').onclick=()=>start(genre)}
 async function start(g){
  genre=g;round=0;score=0;userId=getUserId();const bank=window.LICENSED_MUSIC_CANONS?.[g]||[];queue=shuffle(bank).slice(0,10).map(x=>({...x}));
  document.getElementById('modernHub')?.classList.add('hidden');$('modernFinish')?.classList.add('hidden');$('modernQuizPlay')?.classList.remove('hidden');$('modernQuizTitle').textContent=TITLES[g];$('modernScore').textContent='0';
  build();$('modernFeedback').textContent='Подключаю лицензированную запись…';prepareCurrent({autoplay:true});window.scrollTo({top:0,behavior:'smooth'});
 }
 function init(){
  const hub=document.getElementById('modernHub');if(!hub)return;
  hub.addEventListener('click',e=>{const b=e.target.closest('[data-genre]');if(!b||!GENRES.has(b.dataset.genre))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(b.dataset.genre)},{capture:true});
  $('modernListen')?.addEventListener('click',e=>{if(!GENRES.has(genre))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();play()},{capture:true});
  $('modernQuizBack')?.addEventListener('click',()=>{if(GENRES.has(genre))stop()},{capture:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
