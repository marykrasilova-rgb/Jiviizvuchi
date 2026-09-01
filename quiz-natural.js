// Curated real-recording composer quiz: recognizable themes, 18-second excerpts, automatic flow.
const naturalWorks=[
 {id:'beethoven5',composer:'Людвиг ван Бетховен',work:'Симфония №5',url:'https://upload.wikimedia.org/wikipedia/commons/e/e6/Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor%2C_op._67_-_i._allegro_con_brio.ogg',start:.4,level:1},
 {id:'grieg-mountain',composer:'Эдвард Григ',work:'В пещере горного короля',url:'https://upload.wikimedia.org/wikipedia/commons/b/bb/Musopen_-_In_the_Hall_Of_The_Mountain_King.ogg',start:1.5,level:1},
 {id:'vivaldi-spring',composer:'Антонио Вивальди',work:'Времена года — Весна',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/The%20Modena%20Chamber%20Orchestra%20-%20Vivaldi%27s%20Spring%2C%20RV%20269%20-%20I.%20Allegro.ogg',start:.6,level:1},
 {id:'dvorak-newworld',composer:'Антонин Дворжак',work:'Симфония №9 «Из Нового Света» — IV часть',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Antonin%20Dvorak%20-%20symphony%20no.%209%20in%20e%20minor%20%27from%20the%20new%20world%27%2C%20op.%2095%20-%20iv.%20allegro%20con%20fuoco.ogg',start:18,level:1},
 {id:'smetana-vltava',composer:'Бедржих Сметана',work:'Влтава',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bedrich%20Smetana%20-%20ma%20vlast%20-%20i.%20vltava%20%27the%20moldau%27.ogg',start:52,level:1},
 {id:'beethoven-elise',composer:'Людвиг ван Бетховен',work:'К Элизе',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Fur%20Elise.ogg',start:.2,level:1},
 {id:'mozart-einekleine',composer:'Вольфганг Амадей Моцарт',work:'Маленькая ночная серенада — I часть',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozart%20-%20Eine%20kleine%20Nachtmusik%20-%201.%20Allegro.ogg',start:.4,level:1},
 {id:'grieg-morning',composer:'Эдвард Григ',work:'Утро',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Musopen%20-%20Morning.ogg',start:1.2,level:1},

 {id:'mozart-turkish',composer:'Вольфганг Амадей Моцарт',work:'Турецкий марш',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozart%20-%20Piano%20Sonata%20No.%2011%20in%20A%20major%20-%20III.%20Allegro%20%28Turkish%20March%29.ogg',start:.5,level:2},
 {id:'bach-toccata',composer:'Иоганн Себастьян Бах',work:'Токката и фуга ре минор',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kevin%20MacLeod%20-%20J%20S%20Bach%20Toccata%20and%20Fugue%20in%20D%20Minor.ogg',start:.2,level:2},
 {id:'mendelssohn-wedding',composer:'Феликс Мендельсон',work:'Свадебный марш',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/A%20Midsummer%20Night%27s%20Dream%20Op.%2061%20Wedding%20March%20%28Mendelssohn%29%20European%20Archive.ogg',start:.5,level:2},
 {id:'tchaikovsky-sugar',composer:'Пётр Чайковский',work:'Щелкунчик — Танец феи Драже',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tchaikovsky%20-%20Dance%20of%20the%20Sugar%20Plum%20Fairy%20-%20The%20Nutcracker.ogg',start:4,level:2},
 {id:'tchaikovsky-swan',composer:'Пётр Чайковский',work:'Лебединое озеро',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tchaikovsky%20-%20Swan%20Lake%20Op.20%20-%20Act%20II%20Pt.1.ogg',start:14,level:2},
 {id:'pachelbel-canon',composer:'Иоганн Пахельбель',work:'Канон ре мажор',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pachelbel%27s%20Canon.ogg',start:.5,level:2},
 {id:'rimsky-bumblebee',composer:'Николай Римский-Корсаков',work:'Полёт шмеля',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rimsky-Korsakov%20-%20flight%20of%20the%20bumblebee.oga',start:.4,level:2},
 {id:'saintsaens-swan',composer:'Камиль Сен-Санс',work:'Карнавал животных — Лебедь',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/JOHN%20MICHEL%20CELLO-SAINT%20SAENS%20CARNIVAL%20OF%20ANIMALS%20THE%20SWAN.ogg',start:1,level:2},
 {id:'bizet-habanera',composer:'Жорж Бизе',work:'Кармен — Хабанера',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kevin%20MacLeod%20-%20Georges%20Bizet%20Habanera.ogg',start:1,level:2},
 {id:'debussy-clair',composer:'Клод Дебюсси',work:'Лунный свет',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Clair%20de%20lune%20%28Claude%20Debussy%29%20Suite%20bergamasque.ogg',start:1,level:2},
 {id:'strauss-radetzky',composer:'Иоганн Штраус-отец',work:'Марш Радецкого',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Radetzky%20March.ogg',start:1,level:2},
 {id:'beethoven-moonlight',composer:'Людвиг ван Бетховен',work:'Лунная соната — I часть',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Beethoven%20Moonlight%201st%20movement.ogg',start:.5,level:2},
 {id:'chopin-nocturne2',composer:'Фредерик Шопен',work:'Ноктюрн ми-бемоль мажор, op. 9 №2',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin%20Nocturne%20Op%209%20No%202.ogg',start:.5,level:2},
 {id:'chopin-minute',composer:'Фредерик Шопен',work:'Вальс ре-бемоль мажор «Минутный»',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin%20Minute%20Waltz.ogg',start:.3,level:2},
 {id:'mozart40',composer:'Вольфганг Амадей Моцарт',work:'Симфония №40 — I часть',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozart%20Symphony%2040%20G%20minor%20-%201%20Molto%20allegro.oga',start:.5,level:2},
 {id:'beethoven-ode',composer:'Людвиг ван Бетховен',work:'Ода к радости',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ode%20to%20Joy.ogg',start:.2,level:2},
 {id:'bizet-toreador',composer:'Жорж Бизе',work:'Кармен — Куплеты Тореадора',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bizet%20-%20Carmen%20-%20Toreador%20Song%20%28French%2C%20Musopen%29.ogg',start:6,level:2},
 {id:'strauss-blue-danube',composer:'Иоганн Штраус-сын',work:'На прекрасном голубом Дунае',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Strauss%2C%20An%20der%20sch%C3%B6nen%20blauen%20Donau.ogg',start:55,level:2},

 {id:'rach-prelude',composer:'Сергей Рахманинов',work:'Прелюдия до-диез минор, op. 3 №2',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sergei%20Rachmaninoff%20performs%20Rachmaninoff%27s%20Prelude%20in%20C%20sharp%20minor%2C%20Op.%203.ogg',start:.3,level:3},
 {id:'handel-hallelujah',composer:'Георг Фридрих Гендель',work:'Мессия — Hallelujah',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Handel%20Messiah%20Hallelujah%20by%20Oratorio%20Chorus.ogg',start:1,level:3},
 {id:'schubert-ave',composer:'Франц Шуберт',work:'Ave Maria',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Schubert%20Ave%20Maria%20ukr.oga',start:14,level:3},
 {id:'chopin-waltz69',composer:'Фредерик Шопен',work:'Вальс си минор, op. 69 №2',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin-waltz-op-69-no-2-in-b-minor.ogg',start:.5,level:3},
 {id:'rimsky-scheherazade',composer:'Николай Римский-Корсаков',work:'Шехеразада',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rimsky-Korsakov.%20Scheherazade%2C%20Symphonic%20Suite%2C%20Op.%2035%20-%2002%20The%20Story%20Of%20The%20Kalandar%20Prince.ogg',start:2,level:3},

 {id:'chopin-nocturne1',composer:'Фредерик Шопен',work:'Ноктюрн си-бемоль минор, op. 9 №1',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chopin%2C%20Nocturne%20No.%201%20in%20B%20Flat%20Minor%2C%20Op.%209.ogg',start:.5,level:4},
 {id:'brahms3',composer:'Иоганнес Брамс',work:'Симфония №3 — I часть',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Johannes%20Brahms%20-%20symphony%20no.%203%20in%20f%20major%2C%20op.%2090%20-%20i.%20allegro%20con%20brio.ogg',start:.5,level:4},
 {id:'borodin-steppes',composer:'Александр Бородин',work:'В Средней Азии',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alexander%20Borodin%20-%20In%20The%20Steppes%20Of%20Central%20Asia.ogg',start:4,level:4}
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
 'Николай Римский-Корсаков':'https://commons.wikimedia.org/wiki/Special:FilePath/Nikolai%20Rimsky-Korsakov%201897.jpg?width=420',
 'Камиль Сен-Санс':'https://commons.wikimedia.org/wiki/Special:FilePath/Camille%20Saint-Sa%C3%ABns%20portrait.jpg?width=420',
 'Жорж Бизе':'https://commons.wikimedia.org/wiki/Special:FilePath/Georges%20Bizet%20portrait%20early%20career.jpg?width=420',
 'Клод Дебюсси':'https://commons.wikimedia.org/wiki/Special:FilePath/Claude%20Debussy%20portrait.jpg?width=420',
 'Иоганн Штраус-отец':'https://commons.wikimedia.org/wiki/Special:FilePath/Johann%20Strauss%20I%20%282%29.jpg?width=420',
 'Фредерик Шопен':'https://commons.wikimedia.org/wiki/Special:FilePath/Frederic%20Chopin%20photo.jpeg?width=420',
 'Сергей Рахманинов':'https://commons.wikimedia.org/wiki/Special:FilePath/Sergei%20Rachmaninoff%20cph.3a40575.jpg?width=420',
 'Георг Фридрих Гендель':'https://commons.wikimedia.org/wiki/Special:FilePath/George%20Frideric%20Handel%20by%20Balthasar%20Denner.jpg?width=420',
 'Франц Шуберт':'https://commons.wikimedia.org/wiki/Special:FilePath/Franz%20Schubert%20by%20Wilhelm%20August%20Rieder%201875.jpg?width=420',
 'Иоганн Штраус-сын':'https://commons.wikimedia.org/wiki/Special:FilePath/Johann%20Strauss%20II%20by%20Fritz%20Luckhardt.jpg?width=420',
 'Иоганнес Брамс':'https://commons.wikimedia.org/wiki/Special:FilePath/Johannes%20Brahms%20portrait.jpg?width=420',
 'Александр Бородин':'https://commons.wikimedia.org/wiki/Special:FilePath/Borodin.jpg?width=420'
};

const naturalComposers=[...new Set(naturalWorks.map(x=>x.composer))];
const naturalPlayer=new Audio();
naturalPlayer.preload='auto';
naturalPlayer.playsInline=true;
let naturalTimer=null,quizLevel=1,quizSeen=[],recentComposers=[],autoAdvanceTimer=null;
const CLIP_SECONDS=18;
const answerCounts={1:3,2:4,3:5,4:6};
const levelDescriptions={
 1:'Знакомство: 8 очень узнаваемых тем, 3 варианта ответа. Каждый фрагмент — 18 секунд.',
 2:'Начинающий: большой набор очень знакомой классики разных эпох, жанров и тембров, 4 варианта. Фрагменты — 18 секунд.',
 3:'Продвинутый: более широкий репертуар, включая романтиков, вокальную и симфоническую музыку, 5 вариантов. Фрагменты — 18 секунд.',
 4:'Эксперт: весь каталог из 35 произведений и 6 вариантов ответа. Фрагменты остаются длинными — 18 секунд.'
};

function stopNatural(){clearTimeout(naturalTimer);naturalTimer=null;naturalPlayer.pause()}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function availableWorks(){if(quizLevel===1)return naturalWorks.filter(w=>w.level===1);if(quizLevel===2)return naturalWorks.filter(w=>w.level<=2);if(quizLevel===3)return naturalWorks.filter(w=>w.level<=3);return naturalWorks}
function availableComposers(){return [...new Set(availableWorks().map(x=>x.composer))]}
function naturalAnswers(correct){const count=answerCounts[quizLevel]||4;let others=shuffled(availableComposers().filter(x=>x!==correct));if(others.length<count-1)others=others.concat(shuffled(naturalComposers.filter(x=>x!==correct&&!others.includes(x))));return shuffled([correct,...others.slice(0,count-1)])}
function chooseWork(){const pool=availableWorks();let source=pool.filter(w=>!quizSeen.includes(w.id));if(!source.length){quizSeen=[];source=pool}const lastTwo=recentComposers.slice(-2);let diverse=source.filter(w=>!lastTwo.includes(w.composer));if(!diverse.length)diverse=source.filter(w=>w.composer!==recentComposers.at(-1));if(diverse.length)source=diverse;const w=source[Math.floor(Math.random()*source.length)];quizSeen.push(w.id);recentComposers.push(w.composer);if(recentComposers.length>2)recentComposers=recentComposers.slice(-2);return w}
function composerButton(name){const b=document.createElement('button');b.className='composer-card';b.dataset.composer=name;const img=document.createElement('img');img.src=composerPortraits[name]||'';img.alt='';img.loading='lazy';img.decoding='async';img.onerror=()=>{img.classList.add('portrait-fallback');img.removeAttribute('src')};const label=document.createElement('span');label.textContent=name;b.append(img,label);b.onclick=()=>answerComposer(b,name);return b}

async function playCurrentQuiz(){if(!currentWork)return;stopNatural();$('quizFeedback').textContent='';try{const needSource=naturalPlayer.getAttribute('src')!==currentWork.url;if(needSource){naturalPlayer.src=currentWork.url;naturalPlayer.load()}const startPlayback=()=>{try{naturalPlayer.currentTime=currentWork.start||0}catch(_){};naturalPlayer.play().then(()=>{naturalTimer=setTimeout(()=>naturalPlayer.pause(),CLIP_SECONDS*1000)}).catch(()=>{$('quizFeedback').textContent='Нажми «Слушать фрагмент» — браузер остановил автоматический запуск.'})};if(naturalPlayer.readyState>=1)startPlayback();else naturalPlayer.onloadedmetadata=()=>{naturalPlayer.onloadedmetadata=null;startPlayback()}}catch(e){console.error(e);$('quizFeedback').textContent='Не удалось загрузить запись. Проверь интернет и попробуй ещё раз.'}}

function naturalNewQuiz(autoplay=false){stopNatural();clearTimeout(autoAdvanceTimer);quizLocked=false;$('quizFeedback').textContent='';$('nextQuiz').classList.add('hidden');currentWork=chooseWork();$('quizRound').textContent=`${quizRound}/10`;const box=$('composerAnswers');box.replaceChildren();for(const name of naturalAnswers(currentWork.composer))box.append(composerButton(name));if(autoplay)playCurrentQuiz()}
function finishQuiz(){stopNatural();clearTimeout(autoAdvanceTimer);$('quizFinish').innerHTML=`Готово! <strong>${quizScore}/10</strong>`;$('quizFinish').classList.remove('hidden');$('playQuiz').classList.add('hidden');$('composerAnswers').classList.add('hidden');$('nextQuiz').classList.add('hidden')}
function goNextQuiz(autoplay=true){quizRound++;if(quizRound>10){finishQuiz();return}naturalNewQuiz(autoplay)}
function setQuizLevel(level){quizLevel=level;document.querySelectorAll('[data-quiz-level]').forEach(b=>b.classList.toggle('on',+b.dataset.quizLevel===level));$('quizLevelDescription').textContent=levelDescriptions[level];quizSeen=[];recentComposers=[];resetQuiz()}
document.querySelectorAll('[data-quiz-level]').forEach(b=>b.onclick=()=>setQuizLevel(+b.dataset.quizLevel));

newQuiz=naturalNewQuiz;
resetQuiz=function(){stopNatural();clearTimeout(autoAdvanceTimer);quizRound=1;quizScore=0;quizSeen=[];recentComposers=[];$('quizScore').textContent='0';$('quizFinish').classList.add('hidden');$('playQuiz').classList.remove('hidden');$('composerAnswers').classList.remove('hidden');$('quizLevelDescription').textContent=levelDescriptions[quizLevel];naturalNewQuiz(false)};
$('playQuiz').onclick=()=>playCurrentQuiz();
$('nextQuiz').onclick=()=>goNextQuiz(true);

answerComposer=function(btn,name){
 if(quizLocked||!currentWork)return;
 const correct=name===currentWork.composer;
 if(correct){
   quizLocked=true;stopNatural();btn.classList.add('correct');quizScore++;$('quizScore').textContent=quizScore;$('quizFeedback').textContent=`Верно! ${currentWork.composer} — ${currentWork.work}. Следующий фрагмент…`;document.querySelectorAll('#composerAnswers button').forEach(b=>b.disabled=true);if(typeof showGameReward==='function')showGameReward(true);autoAdvanceTimer=setTimeout(()=>goNextQuiz(true),650);
 }else{
   btn.classList.add('wrong');btn.disabled=true;$('quizFeedback').textContent='Пока нет. Послушай ещё раз или выбери другой вариант.';if(typeof showGameReward==='function')showGameReward(false);
 }
};
