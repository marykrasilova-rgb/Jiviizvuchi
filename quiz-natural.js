// Natural-recording override for the composer quiz.
// Sources are Wikimedia Commons recordings with reusable/public-domain licensing.
const naturalWorks=[
  {composer:'Людвиг ван Бетховен',work:'Симфония №5',url:'https://upload.wikimedia.org/wikipedia/commons/e/e6/Ludwig_van_Beethoven_-_symphony_no._5_in_c_minor%2C_op._67_-_i._allegro_con_brio.ogg',start:0,duration:12},
  {composer:'Эдвард Григ',work:'В пещере горного короля',url:'https://upload.wikimedia.org/wikipedia/commons/b/bb/Musopen_-_In_the_Hall_Of_The_Mountain_King.ogg',start:0,duration:14},
  {composer:'Вольфганг Амадей Моцарт',work:'Маленькая ночная серенада — Менуэт',url:'https://upload.wikimedia.org/wikipedia/commons/a/a0/Mozart_K525_Serenade_in_G_Major_3_-_Minuet.ogg',start:0,duration:12},
  {composer:'Пётр Чайковский',work:'Лебединое озеро',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tchaikovsky%20-%20Swan%20Lake%20Op.20%20-%20Act%20II%20Pt.1.ogg',start:0,duration:14}
];
const naturalComposers=naturalWorks.map(x=>x.composer);
const naturalPlayer=new Audio();naturalPlayer.preload='metadata';naturalPlayer.playsInline=true;
let naturalTimer=null;
function stopNatural(){clearTimeout(naturalTimer);naturalPlayer.pause()}
function naturalAnswers(correct){return [...naturalComposers].sort(()=>Math.random()-.5)}
function naturalNewQuiz(){
  stopNatural();quizLocked=false;$('quizFeedback').textContent='';$('nextQuiz').classList.add('hidden');
  currentWork=naturalWorks[Math.floor(Math.random()*naturalWorks.length)];$('quizRound').textContent=`${quizRound}/10`;
  const box=$('composerAnswers');box.replaceChildren();
  for(const name of naturalAnswers(currentWork.composer)){const b=document.createElement('button');b.textContent=name;b.onclick=()=>answerComposer(b,name);box.append(b)}
}
newQuiz=naturalNewQuiz;
resetQuiz=function(){stopNatural();quizRound=1;quizScore=0;$('quizScore').textContent='0';$('quizFinish').classList.add('hidden');$('playQuiz').classList.remove('hidden');$('composerAnswers').classList.remove('hidden');naturalNewQuiz()};
$('playQuiz').onclick=async()=>{
  if(!currentWork)return;stopNatural();
  try{
    if(naturalPlayer.src!==currentWork.url){naturalPlayer.src=currentWork.url;naturalPlayer.load()}
    const start=()=>{try{naturalPlayer.currentTime=currentWork.start||0}catch(_){};naturalPlayer.play().then(()=>{naturalTimer=setTimeout(()=>naturalPlayer.pause(),currentWork.duration*1000)}).catch(()=>{$('quizFeedback').textContent='Не удалось запустить запись. Нажми «Слушать фрагмент» ещё раз.'})};
    if(naturalPlayer.readyState>=1)start();else naturalPlayer.onloadedmetadata=()=>{naturalPlayer.onloadedmetadata=null;start()};
  }catch(e){console.error(e);$('quizFeedback').textContent='Не удалось загрузить запись. Проверь интернет и попробуй ещё раз.'}
};
const oldAnswerComposer=answerComposer;answerComposer=function(btn,name){stopNatural();oldAnswerComposer(btn,name)};
