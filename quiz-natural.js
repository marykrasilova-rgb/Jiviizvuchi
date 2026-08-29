// Natural-recording composer quiz with four progressive difficulty levels.
// Each source should be a reusable/public-domain recording; expand only after checking recording rights.
const naturalWorks=[
 {id:'beethoven5',composer:'Людвиг ван Бетховен',work:'Симфония №5',url:'https://upload.wikimedia.org/wikipedia/commons/e/e6/Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor%2C_op._67_-_i._allegro_con_brio.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'grieg-mountain',composer:'Эдвард Григ',work:'В пещере горного короля',url:'https://upload.wikimedia.org/wikipedia/commons/b/bb/Musopen_-_In_the_Hall_Of_The_Mountain_King.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'mozart-k525',composer:'Вольфганг Амадей Моцарт',work:'Маленькая ночная серенада — Менуэт',url:'https://upload.wikimedia.org/wikipedia/commons/a/a0/Mozart_K525_Serenade_in_G_Major_3_-_Minuet.ogg',start:0,durationByLevel:[15,12,9,6],level:1},
 {id:'tchaikovsky-swan',composer:'Пётр Чайковский',work:'Лебединое озеро',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tchaikovsky%20-%20Swan%20Lake%20Op.20%20-%20Act%20II%20Pt.1.ogg',start:0,durationByLevel:[15,12,9,6],level:1}
];
const naturalComposers=[...new Set(naturalWorks.map(x=>x.composer))];
const naturalPlayer=new Audio();naturalPlayer.preload='metadata';naturalPlayer.playsInline=true;
let naturalTimer=null,quizLevel=1,lastWorkId=null;
const levelDescriptions={1:'Знакомство: самые узнаваемые темы, 3 варианта ответа, 15 секунд.',2:'Начинающий: 4 варианта ответа, фрагмент короче — 12 секунд.',3:'Продвинутый: 4 варианта, 9 секунд. Библиотека будет расширяться более сложными произведениями.',4:'Эксперт: короткий фрагмент 6 секунд. По мере роста библиотеки здесь появятся менее очевидные темы.'};
function stopNatural(){clearTimeout(naturalTimer);naturalPlayer.pause()}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function availableWorks(){const pool=naturalWorks.filter(w=>w.level<=quizLevel);return pool.length?pool:naturalWorks}
function naturalAnswers(correct){const count=quizLevel===1?3:4;const others=shuffled(naturalComposers.filter(x=>x!==correct)).slice(0,count-1);return shuffled([correct,...others])}
function chooseWork(){const pool=availableWorks();const alternatives=pool.filter(w=>w.id!==lastWorkId);const source=alternatives.length?alternatives:pool;const w=source[Math.floor(Math.random()*source.length)];lastWorkId=w.id;return w}
function naturalNewQuiz(){stopNatural();quizLocked=false;$('quizFeedback').textContent='';$('nextQuiz').classList.add('hidden');currentWork=chooseWork();$('quizRound').textContent=`${quizRound}/10`;const box=$('composerAnswers');box.replaceChildren();for(const name of naturalAnswers(currentWork.composer)){const b=document.createElement('button');b.textContent=name;b.onclick=()=>answerComposer(b,name);box.append(b)}}
function setQuizLevel(level){quizLevel=level;document.querySelectorAll('[data-quiz-level]').forEach(b=>b.classList.toggle('on',+b.dataset.quizLevel===level));$('quizLevelDescription').textContent=levelDescriptions[level];lastWorkId=null;resetQuiz()}
document.querySelectorAll('[data-quiz-level]').forEach(b=>b.onclick=()=>setQuizLevel(+b.dataset.quizLevel));
newQuiz=naturalNewQuiz;
resetQuiz=function(){stopNatural();quizRound=1;quizScore=0;$('quizScore').textContent='0';$('quizFinish').classList.add('hidden');$('playQuiz').classList.remove('hidden');$('composerAnswers').classList.remove('hidden');$('quizLevelDescription').textContent=levelDescriptions[quizLevel];naturalNewQuiz()};
$('playQuiz').onclick=async()=>{if(!currentWork)return;stopNatural();try{if(naturalPlayer.src!==currentWork.url){naturalPlayer.src=currentWork.url;naturalPlayer.load()}const startPlayback=()=>{try{naturalPlayer.currentTime=currentWork.start||0}catch(_){};naturalPlayer.play().then(()=>{const duration=currentWork.durationByLevel[quizLevel-1];naturalTimer=setTimeout(()=>naturalPlayer.pause(),duration*1000)}).catch(()=>{$('quizFeedback').textContent='Не удалось запустить запись. Нажми «Слушать фрагмент» ещё раз.'})};if(naturalPlayer.readyState>=1)startPlayback();else naturalPlayer.onloadedmetadata=()=>{naturalPlayer.onloadedmetadata=null;startPlayback()}}catch(e){console.error(e);$('quizFeedback').textContent='Не удалось загрузить запись. Проверь интернет и попробуй ещё раз.'}};
const oldAnswerComposer=answerComposer;answerComposer=function(btn,name){stopNatural();oldAnswerComposer(btn,name)};
