// Rock, pop and minimalism runtime.
// First tries the commercial original-recording catalogue. If it is unavailable,
// the game automatically switches to a real openly licensed Wikimedia Commons bank.
(()=>{
 const GENRES=new Set(['rock','pop','minimal']);
 const TITLES={rock:'Рок — великие хиты',pop:'Поп — великие хиты',minimal:'Минимализм и постминимализм'};
 const OPEN_TITLES={rock:'Рок — реальная открытая музыка',pop:'Поп — реальная открытая музыка',minimal:'Минимализм — реальная открытая музыка'};
 let genre='',queue=[],round=0,score=0,current=null,audio=null,stopTimer=null,startedAt=0,userId='',audioReady=false,loadingAudio=false,openMode=false,skippedOpen=0;
 const $=id=>document.getElementById(id),shuffle=a=>[...a].sort(()=>Math.random()-.5);
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 function getUserId(){let id=localStorage.getItem('mariaMusicLicensedUser');if(!id){id=(crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`);localStorage.setItem('mariaMusicLicensedUser',id)}return id}
 function stop(){if(stopTimer)clearTimeout(stopTimer);stopTimer=null;if(audio){try{audio.pause()}catch(e){}audio=null}}
 function report(track,seconds){if(openMode||!track?.trackId||!userId)return;fetch('/api/music-preview-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({trackId:track.trackId,userId,seconds})}).catch(()=>{})}
 async function resolveLicensed(track){if(track.preview)return track;const u=`/api/music-preview?artist=${encodeURIComponent(track.artist)}&work=${encodeURIComponent(track.work)}`;const r=await fetch(u);const j=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(new Error(j.error||'preview unavailable'),{status:r.status,configured:j.configured});track.preview=j.audioUrl;track.trackId=j.trackId;track.country=j.country;track.provider=j.provider;return track}
 async function resolveOpen(track){if(track.preview)return track;if(!window.resolveCommonsAudio)throw new Error('Open audio resolver missing');track.preview=await window.resolveCommonsAudio(track);track.provider='Wikimedia Commons';return track}
 async function photo(title){try{const r=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title));if(!r.ok)return '';const j=await r.json();return j.thumbnail?.source||''}catch(e){return ''}}
 async function fillPhotos(){const cards=[...document.querySelectorAll('#modernAnswers [data-photo]')];await Promise.all(cards.map(async c=>{const src=await photo(c.dataset.photo);if(src){const im=c.querySelector('img');if(im){im.src=src;im.hidden=false}c.querySelector('.artist-placeholder')?.remove()}}))}
 function canonicalBank(){const bank=window.LICENSED_MUSIC_CANONS?.[genre]||[];if((genre==='rock'||genre==='pop')&&bank.some(x=>x.tier===1))return bank.filter(x=>x.tier===1);return bank}
 function activeBank(){return openMode?(window.OPEN_AUDIO_BANKS?.[genre]||[]):canonicalBank()}
 function pool(){const bank=openMode?activeBank():(window.LICENSED_MUSIC_CANONS?.[genre]||activeBank());const seen=new Set();return bank.filter(x=>!seen.has(x.artist)&&seen.add(x.artist))}
 function setListenState(enabled,label){const b=$('modernListen');if(!b)return;b.disabled=!enabled;b.setAttribute('aria-disabled',String(!enabled));b.classList.toggle('is-loading',loadingAudio);const span=b.querySelector('span');if(span)span.textContent=label||'Слушать фрагмент'}
 function setCardsEnabled(enabled){$('modernAnswers')?.querySelectorAll('button').forEach(b=>{b.disabled=!enabled;b.classList.toggle('awaiting-audio',!enabled)})}
 function setModeCopy(){const intro=document.querySelector('#modernQuizPlay > p.muted');const prompt=document.querySelector('#modernQuizPlay .play-zone > p');if(openMode){if(intro)intro.textContent='Сейчас играет настоящая музыка из открытого каталога. Послушай фрагмент, выбери автора и постепенно запоминай новые имена.';if(prompt)prompt.textContent='Кто играет?'}else{if(intro)intro.textContent='Послушай музыкальную подсказку и выбери автора, группу или исполнителя. Варианты ответа показываются с фотографиями.';if(prompt)prompt.textContent='Кто это?'}}
 function restoreGenericCopy(){const intro=document.querySelector('#modernQuizPlay > p.muted');const prompt=document.querySelector('#modernQuizPlay .play-zone > p');if(intro)intro.textContent='Послушай музыкальную подсказку и выбери автора, группу или исполнителя. Варианты ответа показываются с фотографиями.';if(prompt)prompt.textContent='Кто это?'}
 function build(){
  current=queue[round];if(!current)return finish();audioReady=!!current.preview;loadingAudio=false;setModeCopy();
  $('modernRound').textContent=`${round+1}/${queue.length}`;$('modernScore').textContent=score;$('modernQuizTitle').textContent=openMode?OPEN_TITLES[genre]:TITLES[genre];
  $('modernFeedback').innerHTML=openMode?'<span class="quiz-ready">Реальная открытая запись · звук уже можно включать после загрузки.</span>':'<span class="quiz-hint">Сначала послушай хит, потом выбери исполнителя.</span>';
  const wrong=shuffle(pool().filter(x=>x.artist!==current.artist)).slice(0,3),choices=shuffle([current,...wrong]);
  $('modernAnswers').innerHTML=choices.map(x=>{const initial=esc((x.artist||'?').trim().slice(0,1).toUpperCase());return `<button type="button" class="artist-answer-card" data-answer="${esc(x.artist)}" data-photo="${esc(x.photoTitle||x.artist)}"><span class="artist-photo"><span class="artist-placeholder">${openMode?initial:'♪'}</span><img hidden alt="${esc(x.artist)}"></span><b>${esc(x.artist)}</b></button>`}).join('');
  $('modernAnswers').querySelectorAll('button').forEach(b=>b.addEventListener('click',ev=>answer(ev.currentTarget,ev.currentTarget.dataset.answer)));fillPhotos();setCardsEnabled(audioReady);setListenState(audioReady,audioReady?'Слушать фрагмент':'Загружаю запись…')
 }
 async function switchToOpen(){
  stop();openMode=true;round=0;score=0;skippedOpen=0;const bank=window.OPEN_AUDIO_BANKS?.[genre]||[];queue=shuffle(bank).slice(0,10).map(x=>({...x}));if(queue.length<4)throw new Error('Нет достаточного открытого аудиобанка');build();
  $('modernFeedback').innerHTML='<span class="quiz-ready">Оригинальные коммерческие хиты сейчас недоступны, поэтому я включила реальную открытую музыку этого жанра. Никаких синтезированных подделок.</span>';await prepareCurrent()
 }
 async function skipBrokenOpen(){
  skippedOpen++;queue.splice(round,1);if(queue.length<4||skippedOpen>6){audioReady=false;setListenState(false,'Запись недоступна');setCardsEnabled(false);$('modernFeedback').innerHTML='<div class="music-unavailable"><b>Не удалось собрать достаточно рабочих открытых записей.</b><span>Попробуй открыть игру ещё раз — Wikimedia могла временно не ответить.</span><button type="button" id="retryLicensedAudio" class="secondary">Попробовать снова</button></div>';$('retryLicensedAudio')?.addEventListener('click',()=>start(genre),{once:true});return}
  if(round>=queue.length)round=0;build();await prepareCurrent()
 }
 async function prepareCurrent(){
  if(!current||loadingAudio)return;loadingAudio=true;setListenState(false,openMode?'Загружаю запись…':'Подключаю оригинал…');
  try{
   if(openMode)await resolveOpen(current);else await resolveLicensed(current);audioReady=true;loadingAudio=false;setListenState(true,'Слушать фрагмент');setCardsEnabled(true);
   $('modernFeedback').innerHTML=openMode?`<span class="quiz-ready">Запись готова · ${esc(current.license||'открытая лицензия')}.</span>`:'<span class="quiz-ready">Оригинальный хит готов. Нажми «Слушать фрагмент».</span>';
   const next=queue[round+1];if(next&&!next.preview){(openMode?resolveOpen(next):resolveLicensed(next)).catch(()=>{})}
  }catch(e){
   loadingAudio=false;
   if(!openMode&&(window.OPEN_AUDIO_BANKS?.[genre]||[]).length>=4){try{await switchToOpen();return}catch(_){} }
   if(openMode){await skipBrokenOpen();return}
   audioReady=false;setListenState(false,'Запись пока недоступна');setCardsEnabled(false);$('modernFeedback').innerHTML='<div class="music-unavailable"><b>Не удалось загрузить музыку.</b><span>Попробуй ещё раз — источник мог временно не ответить.</span><button type="button" id="retryLicensedAudio" class="secondary">Попробовать снова</button></div>';$('retryLicensedAudio')?.addEventListener('click',prepareCurrent,{once:true})
  }
 }
 function play(){
  if(!current?.preview){if(!loadingAudio)prepareCurrent();return}stop();audio=new Audio(current.preview);audio.preload='auto';audio.playsInline=true;const start=Math.max(0,Number(current.start)||0);if(start){audio.addEventListener('loadedmetadata',()=>{try{if(Number.isFinite(audio.duration)&&audio.duration>start+1)audio.currentTime=start}catch(e){}},{once:true})}startedAt=Date.now();
  const p=audio.play();if(p?.then)p.then(()=>{$('modernFeedback').innerHTML=openMode?'<span class="quiz-playing">Играет реальная открытая запись · около 20 секунд</span>':'<span class="quiz-playing">Играет оригинальный хит · до 20 секунд</span>';stopTimer=setTimeout(()=>{const t=current;const secs=Math.min(20,Math.round((Date.now()-startedAt)/1000));stop();report(t,secs)},20000)}).catch(()=>{$('modernFeedback').innerHTML='<span class="quiz-hint">Нажми «Слушать фрагмент» ещё раз — iPhone иногда блокирует первый запуск.</span>'})
 }
 function answer(btn,name){
  if(!audioReady)return;if(name!==current.artist){btn.classList.add('wrong');btn.disabled=true;$('modernFeedback').textContent='Не он. Попробуй ещё.';if(typeof recordGameAnswer==='function')recordGameAnswer('modern',false);return}
  const played=audio?Math.min(20,Math.round((Date.now()-startedAt)/1000)):0,answered=current;stop();if(played)report(answered,played);btn.classList.add('correct');$('modernAnswers').querySelectorAll('button').forEach(b=>b.disabled=true);score++;$('modernScore').textContent=score;
  const source=openMode&&window.commonsFilePage?window.commonsFilePage(answered):'';const yt=!openMode&&window.youtubeMusicSearchUrl?window.youtubeMusicSearchUrl(answered):'';const extra=openMode?`<small>${esc(answered.era||'')} · ${esc(answered.license||'открытая лицензия')}</small>`:`<small>${esc(answered.era||'')}</small>`;
  $('modernFeedback').innerHTML=`<div class="answer-reveal"><b>Верно!</b><span>${esc(answered.artist)} — ${esc(answered.work)}</span>${extra}${source?`<a href="${source}" target="_blank" rel="noopener">Источник и лицензия ↗</a>`:''}${yt?`<a href="${yt}" target="_blank" rel="noopener">Слушать полностью ↗</a>`:''}</div>`;
  if(typeof recordGameAnswer==='function')recordGameAnswer('modern',true);round++;if(round>=queue.length)return setTimeout(finish,900);setTimeout(()=>{build();prepareCurrent()},900)
 }
 function finish(){stop();$('modernQuizPlay').classList.add('hidden');const f=$('modernFinish');f.classList.remove('hidden');const pct=queue.length?score/queue.length:0;f.innerHTML=`<h3>${score}/${queue.length}</h3><p>${pct>=.8?'Отлично!':pct>=.5?'Очень хорошо.':'Ещё один раунд — и узнавание станет увереннее.'}</p><button class="primary" id="licensedAgain">Сыграть ещё</button>`;$('licensedAgain').onclick=()=>start(genre)}
 function start(g){genre=g;round=0;score=0;openMode=false;skippedOpen=0;userId=getUserId();const bank=(g==='rock'||g==='pop')?(window.LICENSED_MUSIC_CANONS?.[g]||[]).filter(x=>x.tier===1):(window.LICENSED_MUSIC_CANONS?.[g]||[]);queue=shuffle(bank).slice(0,10).map(x=>({...x}));document.getElementById('modernHub')?.classList.add('hidden');$('modernFinish')?.classList.add('hidden');$('modernQuizPlay')?.classList.remove('hidden');$('modernQuizTitle').textContent=TITLES[g];$('modernScore').textContent='0';if(!queue.length){switchToOpen();return}build();prepareCurrent();window.scrollTo({top:0,behavior:'smooth'})}
 function init(){const hub=document.getElementById('modernHub');if(!hub)return;hub.addEventListener('click',e=>{const b=e.target.closest('[data-genre]');if(!b||!GENRES.has(b.dataset.genre))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();start(b.dataset.genre)},{capture:true});$('modernListen')?.addEventListener('click',e=>{if(!GENRES.has(genre))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();play()},{capture:true});$('modernQuizBack')?.addEventListener('click',()=>{if(GENRES.has(genre))stop();restoreGenericCopy()},{capture:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
