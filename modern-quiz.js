// Real-audio genre quiz. No synthesized imitation clues.
// Public-domain / CC audio is streamed from Wikimedia Commons.
const REAL_AUDIO_LIBRARY={
 jazz:[
  {artist:'Scott Joplin',work:'Maple Leaf Rag',start:4,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/db/Maple_leaf_rag_-_played_by_Scott_Joplin_1916_V2.ogg/Maple_leaf_rag_-_played_by_Scott_Joplin_1916_V2.ogg.mp3',wiki:'Scott Joplin'},
  {artist:'Mamie Smith',work:'Crazy Blues',start:8,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/dc/Mamie_Smith%2C_Crazy_Blues.ogg/Mamie_Smith%2C_Crazy_Blues.ogg.mp3',wiki:'Mamie Smith'},
  {artist:'Bessie Smith',work:'Downhearted Blues',start:8,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/27/Bessie_Smith_-_Downhearted_Blues_%281923%29.ogg/Bessie_Smith_-_Downhearted_Blues_%281923%29.ogg.mp3',wiki:'Bessie Smith'},
  {artist:"Henderson's Club Alabam' Orchestra",work:'31st Street Blues',start:10,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/31st%20Street%20Blues%20-%20Henderson%27s%20Club%20Alabam%27%20Orchestra%20%281923%29.mp3",wiki:'Fletcher Henderson'}
 ],
 academic:[
  {artist:'Maurice Ravel',work:'Boléro',start:28,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c3/Bolero-Maurice_Ravel-1930.ogg/Bolero-Maurice_Ravel-1930.ogg.mp3',wiki:'Maurice Ravel'},
  {artist:'George Gershwin',work:'Rhapsody in Blue',start:14,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/George%20Gershwin%27s%20%22Rhapsody%20in%20Blue%22%20piano%20solo.mp3",wiki:'George Gershwin'}
 ]
};
const LOCKED_REAL_GENRES={
 rock:'Для рока я убрала синтез. Здесь нужны лицензированные оригинальные записи групп.',
 pop:'Для поп-музыки я убрала синтез. Здесь нужны лицензированные оригинальные записи исполнителей.',
 minimal:'Для современного минимализма я убрала синтез. Подключу только реальные записи с подходящей лицензией.'
};
const mqGenreTitles={academic:'Академическая музыка XX века',jazz:'Ранний джаз и блюз',rock:'Рок',pop:'Поп',minimal:'Минимализм'};
let mqGenre='jazz',mqRound=0,mqScore=0,mqCurrent=null,mqQueue=[],mqAudio=null,mqStopTimer=null;
const mqEl=id=>document.getElementById(id);
const mqShuffle=a=>[...a].sort(()=>Math.random()-.5);
const photoCache=new Map();
function tracks(){return REAL_AUDIO_LIBRARY[mqGenre]||[]}
function stopRealAudio(){if(mqStopTimer){clearTimeout(mqStopTimer);mqStopTimer=null}if(mqAudio){try{mqAudio.pause();mqAudio.currentTime=0}catch(e){}}}
function playRealExcerpt(){
 if(!mqCurrent)return;
 stopRealAudio();
 mqAudio=new Audio(mqCurrent.audio);
 mqAudio.preload='auto';
 mqAudio.volume=1;
 const feedback=mqEl('modernFeedback');
 if(feedback)feedback.textContent='Загружаю реальную запись…';
 const begin=()=>{
  try{mqAudio.currentTime=mqCurrent.start||0}catch(e){}
  const p=mqAudio.play();
  if(p&&p.then)p.then(()=>{if(feedback)feedback.textContent='Играет фрагмент · около 18 секунд';mqStopTimer=setTimeout(()=>{try{mqAudio.pause()}catch(e){}},18000)}).catch(()=>{if(feedback)feedback.textContent='Нажми «Слушать» ещё раз — iPhone иногда блокирует первый запуск звука.'});
 };
 if(mqAudio.readyState>=1)begin(); else mqAudio.addEventListener('loadedmetadata',begin,{once:true});
 mqAudio.addEventListener('error',()=>{if(feedback)feedback.textContent='Не удалось загрузить эту запись. Переключаю вопрос.'},{once:true});
}
async function fetchPhoto(title){
 if(photoCache.has(title))return photoCache.get(title);
 try{
  const url='https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title);
  const r=await fetch(url); if(!r.ok)throw new Error('photo');
  const j=await r.json(); const src=j.thumbnail?.source||''; photoCache.set(title,src); return src;
 }catch(e){photoCache.set(title,'');return ''}
}
async function hydratePhotos(){
 const cards=[...document.querySelectorAll('#modernAnswers [data-photo-title]')];
 await Promise.all(cards.map(async card=>{const src=await fetchPhoto(card.dataset.photoTitle);const img=card.querySelector('img');if(img&&src){img.src=src;img.hidden=false;card.querySelector('.artist-placeholder')?.remove()}}));
}
function answerPool(){
 const base=tracks().map(x=>({name:x.artist,wiki:x.wiki}));
 const fallback={jazz:[['Louis Armstrong','Louis Armstrong'],['Duke Ellington','Duke Ellington'],['King Oliver','King Oliver']],academic:[['Claude Debussy','Claude Debussy'],['Igor Stravinsky','Igor Stravinsky'],['Sergei Rachmaninoff','Sergei Rachmaninoff'],['Sergei Prokofiev','Sergei Prokofiev']]}[mqGenre]||[];
 fallback.forEach(x=>base.push({name:x[0],wiki:x[1]}));
 return base;
}
function buildQuestion(){
 const list=tracks(); if(!list.length)return false;
 if(!mqQueue.length)mqQueue=mqShuffle(list);
 mqCurrent=mqQueue.shift();
 mqEl('modernRound').textContent=`${mqRound+1}/10`;
 mqEl('modernScore').textContent=mqScore;
 mqEl('modernQuizTitle').textContent=mqGenreTitles[mqGenre]||'Угадай';
 mqEl('modernFeedback').textContent='';
 const pool=answerPool();
 const wrong=mqShuffle(pool.filter(x=>x.name!==mqCurrent.artist)).slice(0,3);
 const choices=mqShuffle([{name:mqCurrent.artist,wiki:mqCurrent.wiki},...wrong]);
 mqEl('modernAnswers').innerHTML=choices.map(x=>`<button type="button" class="artist-answer-card" data-modern-answer="${x.name.replaceAll('&','&amp;').replaceAll('"','&quot;')}" data-photo-title="${x.wiki.replaceAll('&','&amp;').replaceAll('"','&quot;')}"><span class="artist-photo"><span class="artist-placeholder">♪</span><img hidden alt=""></span><b>${x.name}</b></button>`).join('');
 mqEl('modernAnswers').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>answerQuestion(btn,btn.dataset.modernAnswer)));
 hydratePhotos();
 return true;
}
function nextQuestionAndPlay(){if(buildQuestion())playRealExcerpt()}
function answerQuestion(btn,name){
 if(name!==mqCurrent.artist){btn.classList.add('wrong');btn.disabled=true;mqEl('modernFeedback').textContent='Не она. Попробуй ещё.';if(typeof recordGameAnswer==='function')recordGameAnswer('modern',false);return}
 btn.classList.add('correct');mqEl('modernAnswers').querySelectorAll('button').forEach(b=>b.disabled=true);mqScore++;mqEl('modernScore').textContent=mqScore;if(typeof recordGameAnswer==='function')recordGameAnswer('modern',true);mqRound++;
 if(mqRound>=10){showFinish();return}
 // Start the next real recording inside the same user gesture so iPhone allows audio.
 nextQuestionAndPlay();
}
function showFinish(){stopRealAudio();mqEl('modernQuizPlay').classList.add('hidden');const f=mqEl('modernFinish');f.classList.remove('hidden');f.innerHTML=`<h3>${mqScore}/10</h3><p>${mqScore>=8?'Отлично!':mqScore>=5?'Очень хорошо.':'Ещё один раунд — и начнёшь узнавать увереннее.'}</p><button class="primary" id="modernAgain">Сыграть ещё</button>`;mqEl('modernAgain').onclick=()=>startModernQuiz(mqGenre)}
function showLockedGenre(key){
 stopRealAudio();document.getElementById('modernHub')?.classList.remove('hidden');mqEl('modernQuizPlay')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');
 let note=document.getElementById('genreNotice');if(!note){note=document.createElement('div');note.id='genreNotice';note.className='genre-notice';document.querySelector('#modernHub .genre-grid')?.after(note)}
 note.classList.remove('hidden');note.innerHTML=`<strong>${mqGenreTitles[key]}</strong><p>${LOCKED_REAL_GENRES[key]}</p><small>Синтетические «электрические» звуки больше не используются.</small>`;note.scrollIntoView({behavior:'smooth',block:'center'});
}
function startModernQuiz(key){
 if(LOCKED_REAL_GENRES[key]){showLockedGenre(key);return}
 mqGenre=key;mqRound=0;mqScore=0;mqQueue=mqShuffle(tracks());document.getElementById('modernHub')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');mqEl('modernQuizPlay')?.classList.remove('hidden');nextQuestionAndPlay();window.scrollTo({top:0,behavior:'smooth'});
}
function closeModernQuiz(){stopRealAudio();mqEl('modernQuizPlay')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');document.getElementById('modernHub')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function initModernQuiz(){mqEl('modernListen')?.addEventListener('click',playRealExcerpt);mqEl('modernQuizBack')?.addEventListener('click',closeModernQuiz);document.querySelectorAll('#modernHub [data-genre]').forEach(btn=>btn.addEventListener('click',()=>startModernQuiz(btn.dataset.genre)))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initModernQuiz);else initModernQuiz();
