// Playable genre guessing game for XX–XXI century.
// Copyrighted recordings are not copied to the site. The quiz uses original synthesized musical clues.
// Artist / composer photos are loaded from Wikipedia page thumbnails at runtime.
const MODERN_CLUES={
 jazz:[
  ['Scott Joplin','Maple Leaf Rag',[64,68,71,72,71,68,64,61],{tempo:112,feel:'rag',root:48}],
  ['Louis Armstrong','West End Blues',[67,70,72,74,72,70,67,65],{tempo:76,feel:'swing',root:46}],
  ['Duke Ellington','Take the “A” Train',[60,64,67,69,67,64,62,60],{tempo:132,feel:'swing',root:48}],
  ['Dave Brubeck Quartet','Take Five',[62,65,69,67,65,62,60,62],{tempo:150,feel:'five',root:50}],
  ['Miles Davis','So What',[62,65,67,69,67,65,62,60],{tempo:116,feel:'modal',root:50}],
  ['John Coltrane','My Favorite Things',[64,71,69,67,64,67,69,71],{tempo:170,feel:'waltz',root:52}],
  ['Thelonious Monk','Round Midnight',[63,66,70,69,66,63,61,63],{tempo:72,feel:'ballad',root:47}],
  ['Herbie Hancock','Cantaloupe Island',[60,63,65,67,65,63,60,58],{tempo:104,feel:'funk',root:48}],
  ['Art Blakey','Moanin’',[58,61,65,63,61,58,56,58],{tempo:122,feel:'shuffle',root:46}],
  ['Weather Report','Birdland',[67,69,71,74,71,69,67,64],{tempo:126,feel:'fusion',root:43}]
 ],
 rock:[
  ['Chuck Berry','Johnny B. Goode',[64,64,67,69,71,69,67,64],{tempo:168,feel:'shuffle',root:40}],
  ['The Beatles','A Day in the Life',[60,64,67,64,62,60,59,60],{tempo:78,feel:'psych',root:48}],
  ['The Rolling Stones','Satisfaction',[64,64,66,67,67,66,64,62],{tempo:136,feel:'riff',root:40}],
  ['Deep Purple','Smoke on the Water',[55,58,60,55,58,61,60,55],{tempo:112,feel:'heavy',root:43}],
  ['Led Zeppelin','Whole Lotta Love',[52,55,57,55,52,50,52,55],{tempo:126,feel:'heavy',root:40}],
  ['Pink Floyd','Another Brick in the Wall',[62,62,65,64,62,60,58,60],{tempo:100,feel:'straight',root:50}],
  ['Queen','Bohemian Rhapsody',[67,67,67,64,67,72,71,69],{tempo:92,feel:'anthem',root:43}],
  ['AC/DC','Back in Black',[52,55,57,52,50,52,55,57],{tempo:94,feel:'riff',root:40}],
  ['Nirvana','Smells Like Teen Spirit',[53,58,56,61,53,58,56,61],{tempo:116,feel:'grunge',root:41}],
  ['The White Stripes','Seven Nation Army',[64,64,67,64,62,60,59,58],{tempo:124,feel:'garage',root:40}]
 ],
 pop:[
  ['ABBA','Dancing Queen',[66,69,71,73,71,69,66,64],{tempo:100,feel:'disco',root:45}],
  ['Bee Gees','Stayin’ Alive',[64,64,67,69,67,64,62,64],{tempo:104,feel:'disco',root:40}],
  ['Stevie Wonder','Superstition',[63,66,68,69,68,66,63,61],{tempo:100,feel:'funk',root:39}],
  ['Michael Jackson','Billie Jean',[54,57,59,57,54,52,54,57],{tempo:116,feel:'popgroove',root:42}],
  ['Prince','Purple Rain',[61,64,68,66,64,61,59,61],{tempo:74,feel:'powerballad',root:49}],
  ['Madonna','Like a Prayer',[64,67,69,71,69,67,64,62],{tempo:112,feel:'gospelpop',root:45}],
  ['Whitney Houston','I Wanna Dance with Somebody',[67,69,71,74,71,69,67,66],{tempo:120,feel:'eighties',root:43}],
  ['Beyoncé','Crazy in Love',[60,63,65,67,65,63,60,58],{tempo:100,feel:'brasspop',root:48}],
  ['Lady Gaga','Bad Romance',[62,62,65,67,65,62,60,62],{tempo:120,feel:'electro',root:38}],
  ['The Weeknd','Blinding Lights',[61,64,68,69,68,64,61,59],{tempo:128,feel:'synthwave',root:49}]
 ],
 minimal:[
  ['Terry Riley','In C',[60,64,67,64,60,64,67,64],{tempo:132,feel:'pulse',root:48}],
  ['Steve Reich','Music for 18 Musicians',[60,62,64,67,64,62,60,62],{tempo:112,feel:'phase',root:48}],
  ['Philip Glass','Glassworks: Opening',[60,67,64,67,60,67,64,67],{tempo:96,feel:'arpeggio',root:48}],
  ['Arvo Pärt','Für Alina',[60,67,72,67,64,67,72,67],{tempo:52,feel:'tintin',root:48}],
  ['Arvo Pärt','Spiegel im Spiegel',[60,62,64,67,69,67,64,62],{tempo:48,feel:'tintin',root:48}],
  ['John Adams','Short Ride in a Fast Machine',[60,64,67,72,67,64,60,64],{tempo:150,feel:'pulse',root:48}],
  ['Michael Nyman','The Heart Asks Pleasure First',[57,60,64,60,57,60,64,67],{tempo:126,feel:'arpeggio',root:45}],
  ['Max Richter','On the Nature of Daylight',[60,63,67,65,63,60,58,60],{tempo:62,feel:'strings',root:48}],
  ['Ólafur Arnalds','Near Light',[62,65,69,67,65,62,60,62],{tempo:72,feel:'felt',root:50}],
  ['Nils Frahm','Says',[57,64,69,64,57,64,69,71],{tempo:108,feel:'synthpulse',root:45}]
 ],
 academic:[
  ['Maurice Ravel','Boléro',[60,62,64,65,64,62,60,59],{tempo:72,feel:'bolero',root:48}],
  ['Igor Stravinsky','The Rite of Spring',[53,54,57,55,53,58,54,57],{tempo:138,feel:'irregular',root:41}],
  ['Sergei Rachmaninoff','Piano Concerto No. 2',[48,55,60,63,60,55,48,51],{tempo:68,feel:'romantic',root:36}],
  ['Sergei Prokofiev','Dance of the Knights',[48,48,51,50,48,46,48,51],{tempo:84,feel:'march',root:36}],
  ['Dmitri Shostakovich','Symphony No. 5',[60,62,63,67,65,63,62,60],{tempo:104,feel:'symphonic',root:48}],
  ['George Gershwin','Rhapsody in Blue',[58,59,60,61,62,63,65,67],{tempo:92,feel:'blue',root:46}],
  ['Gustav Holst','Mars, The Planets',[48,55,53,50,48,55,53,50],{tempo:108,feel:'five',root:36}],
  ['Carl Orff','O Fortuna',[50,50,53,55,53,50,48,50],{tempo:128,feel:'choral',root:38}],
  ['Samuel Barber','Adagio for Strings',[60,62,63,65,67,65,63,62],{tempo:50,feel:'strings',root:48}],
  ['Leonard Bernstein','West Side Story: Mambo',[60,63,65,67,65,63,60,58],{tempo:142,feel:'latin',root:48}]
 ]
};

const WIKI_TITLES={
 'Scott Joplin':'Scott Joplin','Louis Armstrong':'Louis Armstrong','Duke Ellington':'Duke Ellington','Dave Brubeck Quartet':'Dave Brubeck','Miles Davis':'Miles Davis','John Coltrane':'John Coltrane','Thelonious Monk':'Thelonious Monk','Herbie Hancock':'Herbie Hancock','Art Blakey':'Art Blakey','Weather Report':'Weather Report (band)',
 'Chuck Berry':'Chuck Berry','The Beatles':'The Beatles','The Rolling Stones':'The Rolling Stones','Deep Purple':'Deep Purple','Led Zeppelin':'Led Zeppelin','Pink Floyd':'Pink Floyd','Queen':'Queen (band)','AC/DC':'AC/DC','Nirvana':'Nirvana (band)','The White Stripes':'The White Stripes',
 'ABBA':'ABBA','Bee Gees':'Bee Gees','Stevie Wonder':'Stevie Wonder','Michael Jackson':'Michael Jackson','Prince':'Prince (musician)','Madonna':'Madonna','Whitney Houston':'Whitney Houston','Beyoncé':'Beyoncé','Lady Gaga':'Lady Gaga','The Weeknd':'The Weeknd',
 'Terry Riley':'Terry Riley','Steve Reich':'Steve Reich','Philip Glass':'Philip Glass','Arvo Pärt':'Arvo Pärt','John Adams':'John Adams (composer)','Michael Nyman':'Michael Nyman','Max Richter':'Max Richter','Ólafur Arnalds':'Ólafur Arnalds','Nils Frahm':'Nils Frahm',
 'Maurice Ravel':'Maurice Ravel','Igor Stravinsky':'Igor Stravinsky','Sergei Rachmaninoff':'Sergei Rachmaninoff','Sergei Prokofiev':'Sergei Prokofiev','Dmitri Shostakovich':'Dmitri Shostakovich','George Gershwin':'George Gershwin','Gustav Holst':'Gustav Holst','Carl Orff':'Carl Orff','Samuel Barber':'Samuel Barber','Leonard Bernstein':'Leonard Bernstein'
};

let mqGenre='jazz';
let mqRound=0;
let mqScore=0;
let mqCurrent=null;
let mqQueue=[];
let mqCtx=null;
let mqNodes=[];
let mqAudioUnlocked=false;
const mqPhotoCache=new Map();

const mqEl=id=>document.getElementById(id);
const mqShuffle=a=>[...a].sort(()=>Math.random()-.5);
const mqHz=m=>440*Math.pow(2,(m-69)/12);
function modernQuizWorks(){return MODERN_CLUES[mqGenre]||[]}

function setModernAudioStatus(text,state=''){
 let el=mqEl('modernAudioStatus');
 if(!el){
  el=document.createElement('div');
  el.id='modernAudioStatus';
  el.className='modern-audio-status';
  const zone=mqEl('modernListen')?.closest('.play-zone');
  zone?.appendChild(el);
 }
 if(el){el.textContent=text;el.dataset.state=state;}
}

async function unlockMqAudio(){
 const AC=window.AudioContext||window.webkitAudioContext;
 if(!AC){setModernAudioStatus('На этом устройстве Web Audio недоступен.','error');return null;}
 try{
  if(!mqCtx||mqCtx.state==='closed')mqCtx=new AC();
  if(mqCtx.state!=='running')await mqCtx.resume();
  if(mqCtx.state==='running'){
   mqAudioUnlocked=true;
   setModernAudioStatus('Звук включён','ok');
   return mqCtx;
  }
 }catch(e){console.warn('Audio unlock failed',e);}
 mqAudioUnlocked=false;
 setModernAudioStatus('Нажми «Слушать» ещё раз — iPhone ждёт касания.','error');
 return mqCtx;
}

function stopModernClue(){
 mqNodes.forEach(n=>{try{n.stop()}catch(e){}});
 mqNodes=[];
}
function mqTone(ctx,m,t,d,type='sine',gain=.09){
 const o=ctx.createOscillator(),g=ctx.createGain();
 o.type=type;o.frequency.value=mqHz(m);
 g.gain.setValueAtTime(.0001,t);
 g.gain.exponentialRampToValueAtTime(gain,t+.015);
 g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+d+.03);mqNodes.push(o);
}
function mqChord(ctx,root,t,d,type='triangle',gain=.025){[0,7,12].forEach((n,i)=>mqTone(ctx,root+n,t+i*.01,d,type,gain));}

async function playModernClue(){
 if(!mqCurrent)return false;
 const ctx=await unlockMqAudio();
 if(!ctx||ctx.state!=='running')return false;
 stopModernClue();
 const meta=mqCurrent[3]||{},tempo=meta.tempo||108,beat=60/tempo,feel=meta.feel||'',root=meta.root||48;
 const now=ctx.currentTime+.045;
 let leadType=mqGenre==='rock'?'sawtooth':mqGenre==='pop'?'triangle':mqGenre==='jazz'?'triangle':'sine';
 let step=beat*.5;
 if(['ballad','powerballad','strings','felt','tintin','romantic'].includes(feel))step=beat;
 const phraseDur=Math.max(2.2,mqCurrent[2].length*step);
 const repeats=Math.max(2,Math.min(6,Math.ceil(14.5/phraseDur)));
 for(let r=0;r<repeats;r++){
  const base=now+r*phraseDur;
  for(let i=0;i<8;i++){
   let t=base+i*beat;
   if(feel==='five')t=base+i*beat*.8;
   if(feel==='waltz')t=base+i*beat*.75;
   mqTone(ctx,root+(i%4===2?7:0),t,beat*.42,mqGenre==='rock'?'square':'sine',.05);
  }
  for(let i=0;i<4;i++){
   const t=base+i*beat*2,rr=root+[0,5,7,0][i];
   if(['disco','popgroove','eighties','electro','synthwave','funk','fusion'].includes(feel)){
    for(let j=0;j<4;j++)mqChord(ctx,rr,t+j*beat*.5,beat*.2,'triangle',.018);
   }else if(['arpeggio','phase','pulse','synthpulse'].includes(feel)){
    for(let j=0;j<8;j++)mqTone(ctx,rr+[0,7,12,7][j%4],t+j*beat*.25,beat*.18,'sine',.027);
   }else mqChord(ctx,rr,t,beat*1.15,mqGenre==='rock'?'sawtooth':'triangle',.02);
  }
  mqCurrent[2].forEach((m,i)=>{
   let t=base+i*step;
   if(feel==='swing'&&i%2)t+=step*.25;
   if(feel==='irregular'&&i%3===2)t+=step*.32;
   const variation=r%2===1&&mqGenre==='jazz'&&i===mqCurrent[2].length-1?2:0;
   mqTone(ctx,m+variation,t,step*.78,leadType,mqGenre==='academic' ? 0.09 : 0.105);
  });
 }
 setModernAudioStatus('Играет музыкальная подсказка','playing');
 window.setTimeout(()=>{if(mqAudioUnlocked)setModernAudioStatus('Можно переслушать','ok');},Math.min(18000,repeats*phraseDur*1000+400));
 return true;
}

function initials(name){return name.split(/[\s/]+/).filter(Boolean).slice(0,2).map(s=>s[0]).join('').toUpperCase();}
async function fetchWikiPhoto(name){
 if(mqPhotoCache.has(name))return mqPhotoCache.get(name);
 const title=WIKI_TITLES[name]||name;
 const params=new URLSearchParams({action:'query',format:'json',origin:'*',redirects:'1',prop:'pageimages',piprop:'thumbnail',pithumbsize:'420',titles:title});
 try{
  const r=await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`,{mode:'cors',credentials:'omit'});
  if(!r.ok)throw new Error(`Wikipedia ${r.status}`);
  const data=await r.json();
  const page=Object.values(data?.query?.pages||{})[0];
  const result={src:page?.thumbnail?.source||'',pageTitle:page?.title||title};
  mqPhotoCache.set(name,result);return result;
 }catch(e){
  console.warn('Photo load failed',name,e);
  const result={src:'',pageTitle:title};mqPhotoCache.set(name,result);return result;
 }
}

function createModernAnswerCard(name){
 const btn=document.createElement('button');btn.type='button';btn.className='modern-answer-card';
 const media=document.createElement('span');media.className='modern-answer-photo';media.setAttribute('aria-hidden','true');
 const fallback=document.createElement('span');fallback.className='modern-answer-fallback';fallback.textContent=initials(name);media.appendChild(fallback);
 const label=document.createElement('span');label.className='modern-answer-name';label.textContent=name;
 btn.append(media,label);
 btn.addEventListener('click',()=>answerModernQuestion(btn,name));
 fetchWikiPhoto(name).then(info=>{
  if(!info.src||!btn.isConnected)return;
  const img=document.createElement('img');img.alt='';img.loading='eager';img.decoding='async';img.src=info.src;
  img.addEventListener('load',()=>{fallback.remove();});
  img.addEventListener('error',()=>{img.remove();});
  media.prepend(img);
 });
 return btn;
}

function ensurePhotoCredit(){
 let credit=mqEl('modernPhotoCredit');
 if(!credit){credit=document.createElement('p');credit.id='modernPhotoCredit';credit.className='modern-photo-credit';credit.textContent='Фотографии: Wikipedia / Wikimedia Commons';mqEl('modernAnswers')?.after(credit);}
}

function buildModernQuestion(){
 const works=modernQuizWorks();if(!works.length)return false;
 if(!mqQueue.length)mqQueue=mqShuffle(works);
 mqCurrent=mqQueue.shift();
 const round=mqEl('modernRound'),score=mqEl('modernScore'),title=mqEl('modernQuizTitle'),feedback=mqEl('modernFeedback'),answers=mqEl('modernAnswers');
 if(!round||!score||!title||!feedback||!answers)return false;
 round.textContent=`${mqRound+1}/10`;score.textContent=mqScore;
 title.textContent=(typeof genreData!=='undefined'&&genreData[mqGenre])?genreData[mqGenre].title:'Угадай';feedback.textContent='';
 answers.classList.add('modern-photo-answers');answers.replaceChildren();
 const wrong=mqShuffle(works.filter(w=>w[0]!==mqCurrent[0])).slice(0,3).map(w=>w[0]);
 mqShuffle([mqCurrent[0],...wrong]).forEach(name=>answers.appendChild(createModernAnswerCard(name)));
 ensurePhotoCredit();return true;
}

function answerModernQuestion(btn,name){
 if(!mqCurrent)return;
 const feedback=mqEl('modernFeedback');
 if(name!==mqCurrent[0]){
  btn.classList.add('wrong');btn.disabled=true;
  if(feedback)feedback.textContent='Почти! Попробуй ещё раз.';
  if(typeof recordGameAnswer==='function')recordGameAnswer('modern',false);return;
 }
 btn.classList.add('correct');mqEl('modernAnswers')?.querySelectorAll('button').forEach(b=>b.disabled=true);
 mqScore++;if(mqEl('modernScore'))mqEl('modernScore').textContent=mqScore;
 if(feedback)feedback.innerHTML=`Верно! <b>${mqCurrent[0]}</b> — ${mqCurrent[1]}`;
 if(typeof recordGameAnswer==='function')recordGameAnswer('modern',true);
 mqRound++;
 if(mqRound>=10){setTimeout(showModernFinish,650);return;}
 setTimeout(()=>{if(buildModernQuestion())playModernClue();},650);
}

function showModernFinish(){
 stopModernClue();mqEl('modernQuizPlay')?.classList.add('hidden');
 const finish=mqEl('modernFinish');if(!finish)return;
 finish.classList.remove('hidden');
 finish.innerHTML=`<h3>${mqScore}/10</h3><p>${mqScore>=8?'Отличный музыкальный кругозор!':mqScore>=5?'Очень хорошо! Ещё один раунд — и будет ещё увереннее.':'Хорошее начало. Здесь можно постепенно знакомиться с музыкой через игру.'}</p><button class="primary" id="modernAgain">Сыграть ещё</button>`;
 mqEl('modernAgain')?.addEventListener('click',async()=>{await unlockMqAudio();startModernQuiz(mqGenre,true);});
}

async function startModernQuiz(key,autoplay=true){
 if(!MODERN_CLUES[key])return;
 mqGenre=key;mqRound=0;mqScore=0;mqQueue=mqShuffle(modernQuizWorks());
 document.getElementById('modernHub')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');mqEl('modernQuizPlay')?.classList.remove('hidden');
 buildModernQuestion();window.scrollTo({top:0,behavior:'smooth'});
 if(autoplay)await playModernClue();
}
function closeModernQuiz(){stopModernClue();mqEl('modernQuizPlay')?.classList.add('hidden');mqEl('modernFinish')?.classList.add('hidden');document.getElementById('modernHub')?.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}

function initModernQuiz(){
 mqEl('modernListen')?.addEventListener('click',async()=>{await playModernClue();});
 mqEl('modernQuizBack')?.addEventListener('click',closeModernQuiz);
 document.querySelectorAll('#modernHub [data-genre]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
   await unlockMqAudio();
   await startModernQuiz(btn.dataset.genre,true);
  });
 });
 setModernAudioStatus('Выбери жанр — звук запустится после касания.');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initModernQuiz);else initModernQuiz();
