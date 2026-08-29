// Natural-recording composer quiz with four progressive difficulty levels.
const naturalWorks=[
 {id:'beethoven5',composer:'Людвиг ван Бетховен',work:'Симфония №5',url:'https://upload.wikimedia.org/wikipedia/commons/e/e6/Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor%2C_op._67_-_i._allegro_con_brio.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'grieg-mountain',composer:'Эдвард Григ',work:'В пещере горного короля',url:'https://upload.wikimedia.org/wikipedia/commons/b/bb/Musopen_-_In_the_Hall_Of_The_Mountain_King.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'mozart-k525',composer:'Вольфганг Амадей Моцарт',work:'Маленькая ночная серенада — Менуэт',url:'https://upload.wikimedia.org/wikipedia/commons/a/a0/Mozart_K525_Serenade_in_G_Major_3_-_Minuet.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'tchaikovsky-swan',composer:'Пётр Чайковский',work:'Лебединое озеро',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tchaikovsky%20-%20Swan%20Lake%20Op.20%20-%20Act%20II%20Pt.1.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'vivaldi-spring',composer:'Антонио Вивальди',work:'Времена года — Весна',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20Modena%20Chamber%20Orchestra%20-%20Vivaldi%27s%20Spring%2C%20RV%20269%20-%20I.%20Allegro.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'bach-joy',composer:'Иоганн Себастьян Бах',work:'Иисус остаётся моей радостью',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bach%2C%20BWV%20147%2C%2010.%20Jesus%20bleibet%20meine%20Freude.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'dvorak-newworld',composer:'Антонин Дворжак',work:'Симфония №9 «Из Нового Света» — IV часть',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Antonin%20Dvorak%20-%20symphony%20no.%209%20in%20e%20minor%20%27from%20the%20new%20world%27%2C%20op.%2095%20-%20iv.%20allegro%20con%20fuoco.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'smetana-vltava',composer:'Бедржих Сметана',work:'Влтава',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bedrich%20Smetana%20-%20ma%20vlast%20-%20i.%20vltava%20%27the%20moldau%27.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'tchaikovsky-sugar',composer:'Пётр Чайковский',work:'Щелкунчик — Танец феи Драже',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tchaikovsky%20-%20Dance%20of%20the%20Sugar%20Plum%20Fairy%20-%20The%20Nutcracker.ogg',start:0,durationByLevel:[15,12,9,6],level:2},
 {id:'mozart-turkish',composer:'Вольфганг Амадей Моцарт',work:'Турецкий марш',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozart%20-%20Piano%20Sonata%20No.%2011%20in%20A%20major%20-%20III.%20Allegro%20%28Turkish%20March%29.ogg',start:0,durationByLevel:[15,12,9,6],level:2},
 {id:'bach-toccata',composer:'Иоганн Себастьян Бах',work:'Токката и фуга ре минор',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kevin%20MacLeod%20-%20J%20S%20Bach%20Toccata%20and%20Fugue%20in%20D%20Minor.ogg',start:0,durationByLevel:[15,12,9,6],level:2},
 {id:'mendelssohn-wedding',composer:'Феликс Мендельсон',work:'Свадебный марш',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/A%20Midsummer%20Night%27s%20Dream%20Op.%2061%20Wedding%20March%20%28Mendelssohn%29%20European%20Archive.ogg',start:0,durationByLevel:[15,12,9,6],level:2},
 {id:'chopin-waltz69',composer:'Фредерик Шопен',work:'Вальс си минор, op. 69 №2',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin-waltz-op-69-no-2-in-b-minor.ogg',start:0,durationByLevel:[15,12,9,6],level:2},
 {id:'chopin-nocturne9',composer:'Фредерик Шопен',work:'Ноктюрн си-бемоль минор, op. 9 №1',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin%2C%20Nocturne%20No.%201%20in%20B%20Flat%20Minor%2C%20Op.%209.ogg',start:0,durationByLevel:[15,12,9,6],level:3},
 {id:'brahms3',composer:'Иоганнес Брамс',work:'Симфония №3',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Johannes%20Brahms%20-%20symphony%20no.%203%20in%20f%20major%2C%20op.%2090%20-%20i.%20allegro%20con%20brio.ogg',start:0,durationByLevel:[15,12,9,6],level:3},
 {id:'borodin-steppes',composer:'Александр Бородин',work:'В Средней Азии',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alexander%20Borodin%20-%20In%20The%20Steppes%20Of%20Central%20Asia.ogg',start:0,durationByLevel:[15,12,9,6],level:3},
 {id:'chopin-nocturne48',composer:'Фредерик Шопен',work:'Ноктюрн до минор, op. 48 №1',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin%20Nocturne%20in%20C%20minor%20Op.%2048%20no.%201%20Luke%20Faulkner.ogg',start:0,durationByLevel:[15,12,9,6],level:4}
];
const composerPortraits={
 'Людвиг ван Бетховен':'https://commons.wikimedia.org/wiki/Special:FilePath/Beethoven%201820.jpg?width=420',
 'Эдвард Григ':'https://commons.wikimedia.org/wiki/Special:FilePath/Edvard%20Grieg%20portrait.jpg?width=420',
 'Вольфганг Амадей Моцарт':'https://commons.wikimedia.org/wiki/Special:FilePath/Barbara%20Krafft%20-%20Portr%C3%A4t%20Wolfgang%20Amadeus%20Mozart%20%281819%29.jpg?width=420',
 'Пётр Чайковский':'https://commons.wikimedia.org/wiki/Special:FilePath/Tchaikovsky%20by%20Reutlinger.jpg?width=420',
 'Антонио Вивальди':'https://commons.wikimedia.org/wiki/Special:FilePath/Antonio%20Vivaldi%20portrait.jpg?width=420',
 'Иоганн Себастьян Бах':'https://commons.wikimedia.org/wiki/Special:FilePath/Johann%20Sebastian%20Bach.jpg?width=420',
 'Антонин Дворжак':'https://commons.wikimedia.org/wiki/Special:FilePath/Anton%C3%ADn%20Dvo%C5%99%C3%A1k%2C%20portrait.jpg?width=420',
 'Бедржих Сметана':'https://commons.wikimedia.org/wiki/Special:FilePath/Bedrich%20Smetana.jpg?width=420',
 'Феликс Мендельсон':'https://commons.wikimedia.org/wiki/Special:FilePath/Mendelssohn%20Bartholdy.jpg?width=420',
 'Фредерик Шопен':'https://commons.wikimedia.org/wiki/Special:FilePath/Chopin%20portrait%201847.jpg?width=420',
 'Иоганнес Брамс':'https://commons.wikimedia.org/wiki/Special:FilePath/Johannes%20Brahms%20portrait.jpg?width=420',
 'Александр Бородин':'https://commons.wikimedia.org/wiki/Special:FilePath/Borodin.jpg?width=420'
};
const naturalComposers=[...new Set(naturalWorks.map(x=>x.composer))];
const naturalPlayer=new Audio();naturalPlayer.preload='metadata';naturalPlayer.playsInline=true;
let naturalTimer=null,quizLevel=1,quizSeen=[],recentComposers=[];
const levelDescriptions={1:'Знакомство: 8 разных композиторов и самые узнаваемые темы, 3 варианта ответа, 15 секунд.',2:'Начинающий: ещё больше произведений и композиторов, 4 варианта, 12 секунд.',3:'Продвинутый: менее очевидные произведения, 4 варианта, 9 секунд.',4:'Эксперт: весь каталог и короткий фрагмент — 6 секунд.'};
function stopNatural(){clearTimeout(naturalTimer);naturalPlayer.pause()}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function availableWorks(){const pool=naturalWorks.filter(w=>w.level<=quizLevel);return pool.length?pool:naturalWorks}
function availableComposers(){return [...new Set(availableWorks().map(x=>x.composer))]}
function naturalAnswers(correct){const count=quizLevel===1?3:4;let others=shuffled(availableComposers().filter(x=>x!==correct));if(others.length<count-1)others=others.concat(shuffled(naturalComposers.filter(x=>x!==correct&&!others.includes(x))));return shuffled([correct,...others.slice(0,count-1)])}
function chooseWork(){const pool=availableWorks();let source=pool.filter(w=>!quizSeen.includes(w.id));if(!source.length){quizSeen=[];source=pool}const lastTwo=recentComposers.slice(-2);let diverse=source.filter(w=>!lastTwo.includes(w.composer));if(!diverse.length)diverse=source.filter(w=>w.composer!==recentComposers.at(-1));if(diverse.length)source=diverse;const w=source[Math.floor(Math.random()*source.length)];quizSeen.push(w.id);recentComposers.push(w.composer);if(recentComposers.length>2)recentComposers=recentComposers.slice(-2);return w}
function composerButton(name){const b=document.createElement('button');b.className='composer-card';b.dataset.composer=name;const img=document.createElement('img');img.src=composerPortraits[name]||'';img.alt='';img.loading='lazy';img.decoding='async';img.onerror=()=>{img.classList.add('portrait-fallback');img.removeAttribute('src')};const label=document.createElement('span');label.textContent=name;b.append(img,label);b.onclick=()=>answerComposer(b,name);return b}
function naturalNewQuiz(){stopNatural();quizLocked=false;$('quizFeedback').textContent='';$('nextQuiz').classList.add('hidden');currentWork=chooseWork();$('quizRound').textContent=`${quizRound}/10`;const box=$('composerAnswers');box.replaceChildren();for(const name of naturalAnswers(currentWork.composer))box.append(composerButton(name))}
function setQuizLevel(level){quizLevel=level;document.querySelectorAll('[data-quiz-level]').forEach(b=>b.classList.toggle('on',+b.dataset.quizLevel===level));$('quizLevelDescription').textContent=levelDescriptions[level];quizSeen=[];recentComposers=[];resetQuiz()}
document.querySelectorAll('[data-quiz-level]').forEach(b=>b.onclick=()=>setQuizLevel(+b.dataset.quizLevel));
newQuiz=naturalNewQuiz;
resetQuiz=function(){stopNatural();quizRound=1;quizScore=0;quizSeen=[];recentComposers=[];$('quizScore').textContent='0';$('quizFinish').classList.add('hidden');$('playQuiz').classList.remove('hidden');$('composerAnswers').classList.remove('hidden');$('quizLevelDescription').textContent=levelDescriptions[quizLevel];naturalNewQuiz()};
$('playQuiz').onclick=async()=>{if(!currentWork)return;stopNatural();try{if(naturalPlayer.src!==currentWork.url){naturalPlayer.src=currentWork.url;naturalPlayer.load()}const startPlayback=()=>{try{naturalPlayer.currentTime=currentWork.start||0}catch(_){};naturalPlayer.play().then(()=>{const duration=currentWork.durationByLevel[quizLevel-1];naturalTimer=setTimeout(()=>naturalPlayer.pause(),duration*1000)}).catch(()=>{$('quizFeedback').textContent='Не удалось запустить запись. Нажми «Слушать фрагмент» ещё раз.'})};if(naturalPlayer.readyState>=1)startPlayback();else naturalPlayer.onloadedmetadata=()=>{naturalPlayer.onloadedmetadata=null;startPlayback()}}catch(e){console.error(e);$('quizFeedback').textContent='Не удалось загрузить запись. Проверь интернет и попробуй ещё раз.'}};
const oldAnswerComposer=answerComposer;answerComposer=function(btn,name){stopNatural();oldAnswerComposer(btn,name)};
