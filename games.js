const $=id=>document.getElementById(id);

function hz(m){return 440*Math.pow(2,(m-69)/12)}
const gamePlayer=new Audio();
gamePlayer.preload='auto';
gamePlayer.playsInline=true;
let currentAudioUrl=null;

function writeText(view,offset,text){for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i))}
function makeWav(notes,beat=.38,wave='sine'){
  const sampleRate=44100;
  const noteDur=beat*.82;
  const totalDur=Math.max(.2,notes.length*beat+.08);
  const samples=Math.ceil(totalDur*sampleRate);
  const buffer=new ArrayBuffer(44+samples*2);
  const view=new DataView(buffer);
  writeText(view,0,'RIFF');
  view.setUint32(4,36+samples*2,true);
  writeText(view,8,'WAVE');
  writeText(view,12,'fmt ');
  view.setUint32(16,16,true);
  view.setUint16(20,1,true);
  view.setUint16(22,1,true);
  view.setUint32(24,sampleRate,true);
  view.setUint32(28,sampleRate*2,true);
  view.setUint16(32,2,true);
  view.setUint16(34,16,true);
  writeText(view,36,'data');
  view.setUint32(40,samples*2,true);
  const attack=.018,release=.06,level=.78;
  for(let i=0;i<samples;i++){
    const t=i/sampleRate;
    const idx=Math.floor(t/beat);
    let sample=0;
    if(idx<notes.length){
      const local=t-idx*beat;
      if(local<noteDur){
        const f=hz(notes[idx]);
        const env=Math.min(1,local/attack,Math.max(0,(noteDur-local)/release));
        const phase=2*Math.PI*f*local;
        let raw=Math.sin(phase);
        if(wave==='triangle')raw=2/Math.PI*Math.asin(Math.sin(phase));
        sample=raw*env*level;
      }
    }
    view.setInt16(44+i*2,Math.max(-1,Math.min(1,sample))*32767,true);
  }
  return new Blob([buffer],{type:'audio/wav'});
}

async function playSeq(notes,beat=.38,type='triangle'){
  try{
    gamePlayer.pause();
    gamePlayer.currentTime=0;
    if(currentAudioUrl)URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl=URL.createObjectURL(makeWav(notes,beat,type));
    gamePlayer.src=currentAudioUrl;
    gamePlayer.volume=1;
    await gamePlayer.play();
    return new Promise(resolve=>{gamePlayer.onended=()=>resolve();});
  }catch(e){
    console.error(e);
    alert('Не удалось включить звук. Проверь громкость телефона и убедись, что звук для Safari не выключен.');
  }
}

const chooser=$('chooser'),pitchGame=$('pitchGame'),quizGame=$('quizGame');
function openGame(name){chooser.classList.add('hidden');pitchGame.classList.toggle('hidden',name!=='pitch');quizGame.classList.toggle('hidden',name!=='quiz');window.scrollTo({top:0,behavior:'smooth'});name==='pitch'?resetPitch():resetQuiz()}
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openGame(b.dataset.open));
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{pitchGame.classList.add('hidden');quizGame.classList.add('hidden');chooser.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})});

let pitchLevel=1,pitchRound=1,pitchScore=0,pitchAnswer='',pitchNotes=[],pitchLocked=false;
const pitchAnswersBox=document.querySelector('.answers.three');
const levelTwoPatterns={
 upup:{ys:[72,45,18],notes:[0,3,6]},
 downdown:{ys:[18,45,72],notes:[0,-3,-6]},
 sameup:{ys:[55,55,20],notes:[0,0,4]},
 upsame:{ys:[72,28,28],notes:[0,4,4]},
 samedown:{ys:[28,28,72],notes:[0,0,-4]},
 downsame:{ys:[18,62,62],notes:[0,-4,-4]},
 updown:{ys:[68,20,68],notes:[0,4,0]},
 downup:{ys:[20,68,20],notes:[0,-4,0]},
 same:{ys:[45,45,45],notes:[0,0,0]}
};
function pitchWord(key){
 if(typeof gt==='function')return gt(key);
 return key==='up'?'Вверх':key==='down'?'Вниз':'На месте';
}
function contourSvg(ys){
 const [a,b,c]=ys;
 return `<svg viewBox="0 0 120 90" aria-hidden="true"><line x1="20" y1="${a}" x2="60" y2="${b}"/><line x1="60" y1="${b}" x2="100" y2="${c}"/><circle cx="20" cy="${a}" r="9"/><circle cx="60" cy="${b}" r="9"/><circle cx="100" cy="${c}" r="9"/></svg>`;
}
function handlePitchGuess(btn,guess){
 if(pitchLocked)return;
 pitchLocked=true;
 const correct=guess===pitchAnswer;
 btn.classList.add(correct?'correct':'wrong');
 const right=pitchAnswersBox.querySelector(`[data-pitch-answer="${pitchAnswer}"]`)||pitchAnswersBox.querySelector(`[data-pitch="${pitchAnswer}"]`);
 if(right)right.classList.add('correct');
 if(correct){pitchScore++;$('pitchScore').textContent=pitchScore;$('pitchFeedback').textContent=typeof gt==='function'?gt('correct'):'Верно!'}
 else if(pitchLevel===2){$('pitchFeedback').textContent=typeof gt==='function'?gt('correctAnswer'):'Правильный рисунок показан зелёным.'}
 else {$('pitchFeedback').textContent=`${typeof gt==='function'?gt('correctAnswer'):'Правильный ответ'}: ${pitchWord(pitchAnswer)}.`}
 $('nextPitch').classList.remove('hidden');
 if(typeof showGameReward==='function')showGameReward(correct);
}
function renderPitchAnswers(){
 pitchAnswersBox.replaceChildren();
 pitchAnswersBox.className=pitchLevel===2?'answers pitch-patterns':'answers three';
 if(pitchLevel===2){
   Object.entries(levelTwoPatterns).forEach(([key,p])=>{
     const b=document.createElement('button');
     b.className='pitch-pattern';b.dataset.pitchAnswer=key;b.innerHTML=contourSvg(p.ys);b.setAttribute('aria-label',key);
     b.onclick=()=>handlePitchGuess(b,key);pitchAnswersBox.append(b);
   });
   return;
 }
 const defs=[['up','↑'],['same','='],['down','↓']];
 defs.forEach(([key,symbol])=>{
   const b=document.createElement('button');b.dataset.pitch=key;b.dataset.pitchAnswer=key;
   const span=document.createElement('span');span.textContent=pitchWord(key);b.append(document.createTextNode(symbol),span);
   b.onclick=()=>handlePitchGuess(b,key);pitchAnswersBox.append(b);
 });
}
document.querySelectorAll('.level[data-level]').forEach(b=>b.onclick=()=>{pitchLevel=+b.dataset.level;document.querySelectorAll('.level[data-level]').forEach(x=>x.classList.toggle('on',x===b));resetPitch()});
function newPitch(){
 pitchLocked=false;$('pitchFeedback').textContent='';$('nextPitch').classList.add('hidden');renderPitchAnswers();
 let start=55+Math.floor(Math.random()*10);
 if(pitchLevel===1){
   const choices=['up','down','same'];pitchAnswer=choices[Math.floor(Math.random()*choices.length)];
   if(pitchAnswer==='same')pitchNotes=[start,start];
   else{const dir=pitchAnswer==='up'?1:-1;const step=2+Math.floor(Math.random()*4);pitchNotes=[start,start+dir*step]}
 }else if(pitchLevel===2){
   const keys=Object.keys(levelTwoPatterns);pitchAnswer=keys[Math.floor(Math.random()*keys.length)];
   const offsets=levelTwoPatterns[pitchAnswer].notes;pitchNotes=offsets.map(n=>start+n);
 }else{
   const choices=['up','down','same'];pitchAnswer=choices[Math.floor(Math.random()*choices.length)];
   const count=4;
   if(pitchAnswer==='same')pitchNotes=Array(count).fill(start);
   else{const dir=pitchAnswer==='up'?1:-1;pitchNotes=[start];for(let i=1;i<count;i++){start+=dir*(1+Math.floor(Math.random()*3));pitchNotes.push(start)}}
 }
 $('pitchRound').textContent=`${pitchRound}/10`;
}
function resetPitch(){pitchRound=1;pitchScore=0;$('pitchScore').textContent='0';$('pitchFinish').classList.add('hidden');$('playPitch').classList.remove('hidden');pitchAnswersBox.classList.remove('hidden');newPitch()}
$('playPitch').onclick=async()=>{await playSeq(pitchNotes,.42,'sine')};
$('nextPitch').onclick=()=>{pitchRound++;if(pitchRound>10){$('pitchFinish').innerHTML=`Готово! <strong>${pitchScore}/10</strong><span class="muted">${pitchScore>=9?'Отличный слух!':pitchScore>=7?'Очень хорошо. Ещё один круг — и будет ещё увереннее.':'Попробуй ещё раз и слушай расстояние между звуками.'}</span>`;$('pitchFinish').classList.remove('hidden');$('playPitch').classList.add('hidden');pitchAnswersBox.classList.add('hidden');$('nextPitch').classList.add('hidden');return}newPitch()};

const works=[{composer:'Людвиг ван Бетховен',work:'Симфония №5',notes:[67,67,67,63,65,65,65,62]},{composer:'Людвиг ван Бетховен',work:'Ода к радости',notes:[64,64,65,67,67,65,64,62,60,60,62,64]},{composer:'Вольфганг Амадей Моцарт',work:'Eine kleine Nachtmusik',notes:[67,62,67,62,67,71,74,71]},{composer:'Вольфганг Амадей Моцарт',work:'Турецкий марш',notes:[71,69,68,69,72,71,69,68]},{composer:'Иоганн Себастьян Бах',work:'Менуэт соль мажор',notes:[67,64,65,67,64,64,69,67,66,64]},{composer:'Иоганн Себастьян Бах',work:'Токката ре минор',notes:[69,67,69,67,69,64,67,62]},{composer:'Антонио Вивальди',work:'Весна',notes:[64,66,68,69,68,66,64,71,69,68]},{composer:'Пётр Чайковский',work:'Лебединое озеро',notes:[62,69,67,66,64,62,66,64,62]},{composer:'Фредерик Шопен',work:'Прелюдия ми минор',notes:[71,72,71,69,68,69,68,66]},{composer:'Эдвард Григ',work:'В пещере горного короля',notes:[59,61,62,64,62,61,59,61]}];
const composers=[...new Set(works.map(x=>x.composer))];let quizRound=1,quizScore=0,currentWork=null,quizLocked=false;
function pickAnswers(correct){const others=composers.filter(x=>x!==correct).sort(()=>Math.random()-.5).slice(0,3);return [...others,correct].sort(()=>Math.random()-.5)}
function newQuiz(){quizLocked=false;$('quizFeedback').textContent='';$('nextQuiz').classList.add('hidden');currentWork=works[Math.floor(Math.random()*works.length)];$('quizRound').textContent=`${quizRound}/10`;const box=$('composerAnswers');box.replaceChildren();for(const name of pickAnswers(currentWork.composer)){const b=document.createElement('button');b.textContent=name;b.onclick=()=>answerComposer(b,name);box.append(b)}}
function resetQuiz(){quizRound=1;quizScore=0;$('quizScore').textContent='0';$('quizFinish').classList.add('hidden');$('playQuiz').classList.remove('hidden');$('composerAnswers').classList.remove('hidden');newQuiz()}
$('playQuiz').onclick=async()=>{if(currentWork)await playSeq(currentWork.notes,.28,'triangle')};
function answerComposer(btn,name){if(quizLocked)return;quizLocked=true;const ok=name===currentWork.composer;[...$('composerAnswers').children].forEach(b=>{if(b.textContent===currentWork.composer)b.classList.add('correct')});if(!ok)btn.classList.add('wrong');else{quizScore++;$('quizScore').textContent=quizScore}$('quizFeedback').textContent=(ok?'Верно! ':'')+`${currentWork.composer} — «${currentWork.work}».`;$('nextQuiz').classList.remove('hidden')}
$('nextQuiz').onclick=()=>{quizRound++;if(quizRound>10){$('quizFinish').innerHTML=`Готово! <strong>${quizScore}/10</strong><span class="muted">${quizScore>=9?'Блестяще!':quizScore>=7?'Очень хороший результат.':'Ещё один круг поможет запомнить музыкальные портреты композиторов.'}</span>`;$('quizFinish').classList.remove('hidden');$('playQuiz').classList.add('hidden');$('composerAnswers').classList.add('hidden');$('nextQuiz').classList.add('hidden');return}newQuiz()};