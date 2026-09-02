// Real-audio genre quiz. No synthesized imitation clues.
// Public-domain / CC audio is streamed from Wikimedia Commons.
// The full jazz canon below is the target licensed bank; only tracks with a real audio URL are played.
const JAZZ_CANON=[
 {artist:'Louis Armstrong',work:'West End Blues',era:'New Orleans / early swing',wiki:'Louis Armstrong'},
 {artist:'Duke Ellington',work:'Take the “A” Train',era:'Swing / big band',wiki:'Duke Ellington'},
 {artist:'Count Basie',work:'One O’Clock Jump',era:'Swing / big band',wiki:'Count Basie'},
 {artist:'Billie Holiday',work:'God Bless the Child',era:'Vocal jazz',wiki:'Billie Holiday'},
 {artist:'Ella Fitzgerald',work:'How High the Moon',era:'Vocal jazz / bebop',wiki:'Ella Fitzgerald'},
 {artist:'Charlie Parker',work:'Ornithology',era:'Bebop',wiki:'Charlie Parker'},
 {artist:'Dizzy Gillespie',work:'A Night in Tunisia',era:'Bebop',wiki:'Dizzy Gillespie'},
 {artist:'Thelonious Monk',work:'Round Midnight',era:'Bebop / modern jazz',wiki:'Thelonious Monk'},
 {artist:'Bud Powell',work:'Un Poco Loco',era:'Bebop',wiki:'Bud Powell'},
 {artist:'Lennie Tristano',work:'Line Up',era:'Cool / modern jazz',wiki:'Lennie Tristano'},
 {artist:'Miles Davis',work:'So What',era:'Modal jazz',wiki:'Miles Davis'},
 {artist:'John Coltrane',work:'My Favorite Things',era:'Modal jazz',wiki:'John Coltrane'},
 {artist:'Dave Brubeck Quartet',work:'Take Five',era:'Cool jazz / odd meter',wiki:'Dave Brubeck Quartet'},
 {artist:'Chet Baker',work:'My Funny Valentine',era:'Cool jazz',wiki:'Chet Baker'},
 {artist:'Gerry Mulligan',work:'Bernie’s Tune',era:'Cool jazz',wiki:'Gerry Mulligan'},
 {artist:'Art Blakey & The Jazz Messengers',work:'Moanin’',era:'Hard bop',wiki:'Art Blakey'},
 {artist:'Horace Silver',work:'Song for My Father',era:'Hard bop',wiki:'Horace Silver'},
 {artist:'Cannonball Adderley',work:'Mercy, Mercy, Mercy',era:'Soul jazz',wiki:'Cannonball Adderley'},
 {artist:'Sonny Rollins',work:'St. Thomas',era:'Hard bop / calypso jazz',wiki:'Sonny Rollins'},
 {artist:'Charles Mingus',work:'Goodbye Pork Pie Hat',era:'Post-bop',wiki:'Charles Mingus'},
 {artist:'Ornette Coleman',work:'Lonely Woman',era:'Free jazz',wiki:'Ornette Coleman'},
 {artist:'Cecil Taylor',work:'Unit Structures',era:'Free jazz / avant-garde',wiki:'Cecil Taylor'},
 {artist:'Eric Dolphy',work:'Out to Lunch!',era:'Avant-garde jazz',wiki:'Eric Dolphy'},
 {artist:'Sun Ra',work:'Space Is the Place',era:'Avant-garde / cosmic jazz',wiki:'Sun Ra'},
 {artist:'Herbie Hancock',work:'Cantaloupe Island',era:'Post-bop / funk',wiki:'Herbie Hancock'},
 {artist:'Wayne Shorter',work:'Footprints',era:'Post-bop',wiki:'Wayne Shorter'},
 {artist:'McCoy Tyner',work:'Passion Dance',era:'Post-bop / modal',wiki:'McCoy Tyner'},
 {artist:'Keith Jarrett',work:'The Köln Concert',era:'Solo / contemporary jazz',wiki:'Keith Jarrett'},
 {artist:'Chick Corea',work:'Spain',era:'Fusion',wiki:'Chick Corea'},
 {artist:'Weather Report',work:'Birdland',era:'Fusion',wiki:'Weather Report'},
 {artist:'Mahavishnu Orchestra',work:'Meeting of the Spirits',era:'Jazz fusion',wiki:'Mahavishnu Orchestra'},
 {artist:'Pat Metheny Group',work:'Last Train Home',era:'Fusion / contemporary jazz',wiki:'Pat Metheny Group'},
 {artist:'Jaco Pastorius',work:'Portrait of Tracy',era:'Fusion',wiki:'Jaco Pastorius'},
 {artist:'Wynton Marsalis',work:'Black Codes (From the Underground)',era:'Neo-bop',wiki:'Wynton Marsalis'},
 {artist:'Brad Mehldau',work:'Exit Music (For a Film)',era:'Contemporary jazz',wiki:'Brad Mehldau'},
 {artist:'Esbjörn Svensson Trio',work:'From Gagarin’s Point of View',era:'European contemporary jazz',wiki:'Esbjörn Svensson Trio'},
 {artist:'Robert Glasper',work:'Afro Blue',era:'Jazz / hip-hop / R&B',wiki:'Robert Glasper'},
 {artist:'Kamasi Washington',work:'Change of the Guard',era:'Contemporary spiritual jazz',wiki:'Kamasi Washington'},
 {artist:'Hiromi Uehara',work:'Return of Kung-Fu World Champion',era:'Contemporary / fusion',wiki:'Hiromi Uehara'},
 {artist:'Esperanza Spalding',work:'I Know You Know',era:'Contemporary jazz',wiki:'Esperanza Spalding'},
 {artist:'Snarky Puppy',work:'Lingus',era:'Contemporary fusion',wiki:'Snarky Puppy'}
];

const REAL_AUDIO_LIBRARY={
 jazz:[
  {artist:'Scott Joplin',work:'Maple Leaf Rag',year:1916,era:'Ragtime',start:4,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/db/Maple_leaf_rag_-_played_by_Scott_Joplin_1916_V2.ogg/Maple_leaf_rag_-_played_by_Scott_Joplin_1916_V2.ogg.mp3',wiki:'Scott Joplin'},
  {artist:'Mamie Smith',work:'Crazy Blues',year:1920,era:'Classic blues',start:8,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/d/dc/Mamie_Smith%2C_Crazy_Blues.ogg/Mamie_Smith%2C_Crazy_Blues.ogg.mp3',wiki:'Mamie Smith'},
  {artist:'Bessie Smith',work:'Downhearted Blues',year:1923,era:'Classic blues',start:8,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/27/Bessie_Smith_-_Downhearted_Blues_%281923%29.ogg/Bessie_Smith_-_Downhearted_Blues_%281923%29.ogg.mp3',wiki:'Bessie Smith'},
  {artist:"Henderson's Club Alabam' Orchestra",work:'31st Street Blues',year:1923,era:'Early big band',start:10,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/31st%20Street%20Blues%20-%20Henderson%27s%20Club%20Alabam%27%20Orchestra%20%281923%29.mp3",wiki:'Fletcher Henderson'},
  {artist:"King Oliver's Creole Jazz Band",work:'Dippermouth Blues',year:1923,era:'New Orleans jazz',start:8,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Dippermouth%20Blues%20-%20KING%20OLIVER%27S%20JAZZ%20BAND.flac",wiki:"King Oliver's Creole Jazz Band"},
  {artist:"King Oliver's Creole Jazz Band",work:'Krooked Blues',year:1923,era:'New Orleans jazz',start:10,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20Oliver%27s%20Creole%20Jazz%20Band--%20%22Krooked%20Blues%22%20%281923%29.ogg",wiki:"King Oliver's Creole Jazz Band"},
  {artist:'Bessie Smith & Louis Armstrong',work:'St. Louis Blues',year:1925,era:'Classic blues / jazz',start:16,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bessie%20Smith%20and%20Louis%20Armstrong%20-%20The%20St.%20Louis%20Blues%20%281925%29.mp3',wiki:'Bessie Smith'},
  {artist:'The Knickerbockers',work:'Manhattan',year:1925,era:'Jazz age',start:10,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Manhattan%20%281925%29%20The%20Knickerbockers%20-%20Columbia%20422-D.mp3',wiki:'The Knickerbockers'},
  {artist:'St. Louis Rhythm Kings',work:"She's My Sheba, I'm Her Sheik",year:1925,era:'New Orleans-style jazz',start:12,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/%22She%27s%20my%20Sheba%2C%20I%27m%20Her%20Sheik%22%20%281925%29%2C%20by%20the%20St.%20Louis%20Rhythm%20Kings.oga',wiki:'St. Louis Rhythm Kings'},
  {artist:'Golden Gate Orchestra',work:'Charleston',year:1925,era:'Jazz age / dance band',start:12,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Charleston%20%281925%29%20-%20Edison%2051542-R.ogg',wiki:'Golden Gate Orchestra'}
 ],
 academic:[
  {artist:'Maurice Ravel',work:'Boléro',start:28,audio:'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c3/Bolero-Maurice_Ravel-1930.ogg/Bolero-Maurice_Ravel-1930.ogg.mp3',wiki:'Maurice Ravel'},
  {artist:'George Gershwin',work:'Rhapsody in Blue',start:14,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/George%20Gershwin%27s%20%22Rhapsody%20in%20Blue%22%20piano%20solo.mp3",wiki:'George Gershwin'},
  {artist:'Sergei Rachmaninoff',work:'Prelude in C-sharp minor, Op. 3 No. 2',start:9,audio:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Sergei%20Rachmaninoff%20performs%20Rachmaninoff%27s%20Prelude%20in%20C%20sharp%20minor%2C%20Op.%203.ogg",wiki:'Sergei Rachmaninoff'},
  {artist:'Claude Debussy',work:'Clair de lune',start:12,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Clair%20de%20lune%20%28Claude%20Debussy%29%20Suite%20bergamasque.ogg',wiki:'Claude Debussy'},
  {artist:'Gustav Holst',work:'Mars, The Bringer of War',start:18,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Holst-%20mars.ogg',wiki:'Gustav Holst'},
  {artist:'Béla Bartók',work:'Sonatina',start:6,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bartok%20-%20Sonatina.ogg',wiki:'Béla Bartók'},
  {artist:'Igor Stravinsky',work:'The Firebird — Infernal Dance',start:8,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Infernal%20Dance%20from%20The%20Firebird%20by%20Stravinsky.ogg',wiki:'Igor Stravinsky'},
  {artist:'Sergei Prokofiev',work:'Piano Sonata No. 2',start:18,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Prokofiev%20-%20Sonata%20No.%202%20%28E.M.%20Zinger%29.ogg',wiki:'Sergei Prokofiev'},
  {artist:'Gustav Mahler',work:'Symphony No. 5 — Trauermarsch',start:8,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mahler%20Symphony%20No.%205%2C%20I.%20Trauermarsch.ogg',wiki:'Gustav Mahler'},
  {artist:'Arnold Schoenberg',work:'String Quartet No. 2 — IV',start:20,audio:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Schoenberg%20Quartet%20No.%202%204th%20movement.OGG',wiki:'Arnold Schoenberg'}
 ]
};
const LOCKED_REAL_GENRES={rock:'Здесь будут только настоящие записи групп. Синтез я убрала; для рок-хитов нужен лицензированный аудиокаталог.',pop:'Здесь будут только настоящие записи исполнителей. Синтез я убрала; для поп-хитов нужен лицензированный аудиокаталог.',minimal:'Для современного минимализма оставлю только реальные записи с подходящей лицензией.'};
const mqGenreTitles={academic:'Академическая музыка XX века',jazz:'Джаз',rock:'Рок',pop:'Поп',minimal:'Минимализм'};
let mqGenre='jazz',mqRound=0,mqScore=0,mqCurrent=null,mqQueue=[],mqAudio=null,mqStopTimer=null;
const mqEl=id=>document.getElementById(id),mqShuffle=a=>[...a].sort(()=>Math.random()-.5),photoCache=new Map();
function tracks(){return REAL_AUDIO_LIBRARY[mqGenre]||[]}function roundTarget(){return Math.min(10,tracks().length)}
function stopRealAudio(){if(mqStopTimer){clearTimeout(mqStopTimer);mqStopTimer=null}if(mqAudio){try{mqAudio.pause();mqAudio.currentTime=0}catch(e){}}}
function playRealExcerpt(){if(!mqCurrent)return;stopRealAudio();mqAudio=new Audio(mqCurrent.audio);mqAudio.preload='auto';mqAudio.volume=1;mqAudio.playsInline=true;const feedback=mqEl('modernFeedback');if(feedback)feedback.textContent='Загружаю реальную запись…';const begin=()=>{try{mqAudio.currentTime=mqCurrent.start||0}catch(e){}const p=mqAudio.play();if(p&&p.then)p.then(()=>{if(feedback)feedback.textContent='Играет настоящий фрагмент · около 18 секунд';mqStopTimer=setTimeout(()=>{try{mqAudio.pause()}catch(e){}},18000)}).catch(()=>{if(feedback)feedback.textContent='Нажми «Слушать фрагмент» — iPhone иногда блокирует первый запуск.'})};if(mqAudio.readyState>=1)begin();else mqAudio.addEventListener('loadedmetadata',begin,{once:true});mqAudio.addEventListener('error',()=>{if(feedback)feedback.textContent='Эта запись сейчас не загрузилась. Нажми «Слушать фрагмент» ещё раз.'},{once:true})}
async function fetchPhoto(title){if(photoCache.has(title))return photoCache.get(title);try{const r=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title));if(!r.ok)throw new Error('photo');const j=await r.json(),src=j.thumbnail?.source||'';photoCache.set(title,src);return src}catch(e){photoCache.set(title,'');return ''}}
async function hydratePhotos(){const cards=[...document.querySelectorAll('#modernAnswers [data-photo-title]')];await Promise.all(cards.map(async card=>{const src=await fetchPhoto(card.dataset.photoTitle),img=card.querySelector('img');if(img&&src){img.src=src;img.hidden=false;card.querySelector('.artist-placeholder')?.remove()}}))}
function answerPool(){const base=(mqGenre==='jazz'?JAZZ_CANON:tracks()).map(x=>({name:x.artist,wiki:x.wiki}));tracks().forEach(x=>base.push({name:x.artist,wiki:x.wiki}));const fallback={academic:[['Erik Satie','Erik Satie'],['Alexander Scriabin','Alexander Scriabin']]}[mqGenre]||[];fallback.forEach(x=>base.push({name:x[0],wiki:x[1]}));const seen=new Set();return base.filter(x=>{if(seen.has(x.name))return false;seen.add(x.name);return true})}
function buildQuestion(){const list=tracks();if(!list.length)return false;if(!mqQueue.length)mqQueue=mqShuffle(list);mqCurrent=mqQueue.shift();mqEl('modernRound').textContent=`${mqRound+1}/${roundTarget()}`;mqEl('modernScore').textContent=mqScore;mqEl('modernQuizTitle').textContent=mqGenreTitles[mqGenre]||'Угадай';mqEl('modernFeedback').textContent='';const listenLabel=mqEl('modernListen')?.querySelector('span');if(listenLabel)listenLabel.textContent='Слушать фрагмент';const pool=answerPool(),wrong=mqShuffle(pool.filter(x=>x.name!==mqCurrent.artist)).slice(0,3),choices=mqShuffle([{name:mqCurrent.artist,wiki:mqCurrent.wiki},...wrong]);mqEl('modernAnswers').innerHTML=choices.map(x=>`<button type="button" class="artist-answer-card" data-modern-answer="${x.name.replaceAll('&','&amp;').replaceAll('"','&quot;')}" data-photo-title="${x.wiki.replaceAll('&','&amp;').replaceAll('"','&quot;')}"><span class="artist-photo"><span class="artist-placeholder">♪</span><img hidden alt="${x.name.replaceAll('&','&amp;').replaceAll('"','&quot;')}"></span><b>${x.name}</b></button>`).join('');mqEl('modernAnswers').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>answerQuestion(btn,btn.dataset.modernAnswer)));hydratePhotos();return true}
function nextQuestionAndPlay(){if(buildQuestion())playRealExcerpt()}
function answerQuestion(btn,name){if(name!==mqCurrent.artist){btn.classList.add('wrong');btn.disabled=true;mqEl('modernFeedback').textContent='Не он. Попробуй ещё.';if(typeof recordGameAnswer==='function')recordGameAnswer('modern',false);return}btn.classList.add('correct');mqEl('modernAnswers').querySelectorAll('button').forEach(b=>b.disabled=true);mqScore++;mqEl('modernScore').textContent=mqScore;const extra=mqGenre==='jazz'&&mqCurrent.year?` · ${mqCurrent.year} · ${mqCurrent.era}`:'';mqEl('modernFeedback').innerHTML=`Верно! <b>${mqCurrent.artist}</b> — ${mqCurrent.work}${extra}`;if(typeof recordGameAnswer==='function')recordGameAnswer('modern',true);mqRound++;if(mqRound>=roundTarget()){showFinish();return}nextQuestionAndPlay()}
function showFinish(){stopRealAudio();mqEl('modernQuizPlay').classList.add('hidden');const f=mqEl('modernFinish');f.classList.remove('hidden');f.innerHTML=`<h3>${mqScore}/${roundTarget()}</h3><p>${mqScore>=8?'Отлично!':mqScore>=5?'Очень хорошо.':'Ещё один раунд — и начнёшь узнавать увереннее.'}</p><button class="primary" id="modernAgain">Сыграть ещё</button>`;mqEl('modernAgain').onclick=()=>startModernQuiz(mqGenre)}
function showLockedGenre(key){stopRealAudio();document.getElementById('modernHub')?.classList.remove('hidden');mqEl('modernQuizPlay')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');let note=document.getElementById('genreNotice');if(!note){note=document.createElement('div');note.id='genreNotice';note.className='genre-notice';document.querySelector('#modernHub .genre-grid')?.after(note)}note.classList.remove('hidden');note.innerHTML=`<strong>${mqGenreTitles[key]}</strong><p>${LOCKED_REAL_GENRES[key]}</p><small>Электрические синтезированные подсказки больше не используются.</small>`;note.scrollIntoView({behavior:'smooth',block:'center'})}
function startModernQuiz(key){if(LOCKED_REAL_GENRES[key]){showLockedGenre(key);return}mqGenre=key;mqRound=0;mqScore=0;mqQueue=mqShuffle(tracks()).slice(0,10);document.getElementById('modernHub')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');mqEl('modernQuizPlay')?.classList.remove('hidden');nextQuestionAndPlay();window.scrollTo({top:0,behavior:'smooth'})}
function closeModernQuiz(){stopRealAudio();mqEl('modernQuizPlay')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');document.getElementById('modernHub')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function initModernQuiz(){mqEl('modernListen')?.addEventListener('click',playRealExcerpt);mqEl('modernQuizBack')?.addEventListener('click',closeModernQuiz);document.querySelectorAll('#modernHub [data-genre]').forEach(btn=>btn.addEventListener('click',()=>startModernQuiz(btn.dataset.genre)))}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initModernQuiz);else initModernQuiz();