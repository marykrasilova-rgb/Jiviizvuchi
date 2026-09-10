// Softer low-frequency movement support. This intercepts only the movement prompt buttons.
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let ctx=null;
let activeButton=null;
let stopTimer=null;
let nodes=[];

const labels={
  soft:['Мягкий пульс','Soft pulse','פעימה רכה'],
  rhythm:['Ритм','Rhythm','קצב'],
  stop:['Остановить','Stop','לעצור']
};

function currentStopLabel(){
  const lang=window.MariaLanguage?.getCurrent?.()||document.documentElement.lang||'ru';
  return lang==='en'?'Stop':lang==='he'?'לעצור':'Остановить';
}

function stop(){
  if(stopTimer){clearTimeout(stopTimer);stopTimer=null}
  nodes.forEach(n=>{try{n.stop()}catch{}});nodes=[];
  if(ctx){try{ctx.close()}catch{}ctx=null}
  if(activeButton){
    activeButton.classList.remove('playing');
    activeButton.textContent=activeButton.dataset.softOriginal||activeButton.textContent;
    activeButton=null;
  }
}

function softTone(context,when,freq,duration,peak){
  const osc=context.createOscillator();
  const gain=context.createGain();
  osc.type='sine';
  osc.frequency.setValueAtTime(freq,when);
  gain.gain.setValueAtTime(0.0001,when);
  gain.gain.exponentialRampToValueAtTime(peak,when+0.09);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0008,peak*0.42),when+duration*0.55);
  gain.gain.exponentialRampToValueAtTime(0.0001,when+duration);
  osc.connect(gain).connect(context.destination);
  osc.start(when);osc.stop(when+duration+0.03);
  nodes.push(osc);
}

function play(button,kind){
  stop();
  if(!AudioCtx)return;
  ctx=new AudioCtx();
  const now=ctx.currentTime+0.08;
  const isSoft=kind==='soft';
  const bpm=isSoft?60:76;
  const step=60/bpm;
  const beats=isSoft?18:24;

  // Very quiet body tone: felt as support rather than as a synth note.
  softTone(ctx,now,98,beats*step+0.5,0.010);
  softTone(ctx,now,116,beats*step+0.5,0.0045);

  for(let i=0;i<beats;i++){
    const strong=i%4===0;
    const freq=isSoft?(strong?104:98):(strong?110:(i%2?92:102));
    const peak=isSoft?(strong?0.030:0.018):(strong?0.034:0.020);
    const dur=isSoft?0.62:0.42;
    softTone(ctx,now+i*step,freq,dur,peak);
    if(!isSoft&&strong)softTone(ctx,now+i*step+0.025,130,0.30,0.008);
  }

  activeButton=button;
  button.dataset.softOriginal=button.dataset.softOriginal||button.textContent.trim();
  button.dataset.softKind=kind;
  button.textContent=currentStopLabel();
  button.classList.add('playing');
  stopTimer=setTimeout(stop,beats*step*1000+650);
}

function identify(button){
  if(button.dataset.softKind)return button.dataset.softKind;
  const text=button.textContent.trim();
  if(labels.soft.includes(text))return 'soft';
  if(labels.rhythm.includes(text))return 'rhythm';
  return null;
}

document.addEventListener('click',e=>{
  const button=e.target.closest?.('.example-helper .btn.secondary');
  if(!button)return;
  const kind=identify(button);
  if(!kind)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if(activeButton===button){stop();return}
  play(button,kind);
},true);

window.addEventListener('pagehide',stop,{once:true});
window.addEventListener('maria:languagechange',()=>{if(activeButton)activeButton.textContent=currentStopLabel()});
