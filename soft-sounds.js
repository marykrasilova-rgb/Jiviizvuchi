// Softer low-frequency movement support. Keeps one simple pulse option for movement.
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let ctx=null;
let activeButton=null;
let stopTimer=null;
let nodes=[];

const labels={
  soft:['Мягкий пульс','Soft pulse','פעימה רכה'],
  rhythm:['Ритм','Rhythm','קצב']
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

function play(button){
  stop();
  if(!AudioCtx)return;
  ctx=new AudioCtx();
  const now=ctx.currentTime+0.08;
  const bpm=60;
  const step=60/bpm;
  const beats=18;

  // Quiet low body tone under a slow, rounded pulse.
  softTone(ctx,now,98,beats*step+0.5,0.010);
  softTone(ctx,now,116,beats*step+0.5,0.0045);

  for(let i=0;i<beats;i++){
    const strong=i%4===0;
    const freq=strong?104:98;
    const peak=strong?0.030:0.018;
    softTone(ctx,now+i*step,freq,0.62,peak);
  }

  activeButton=button;
  button.dataset.softOriginal=button.dataset.softOriginal||button.textContent.trim();
  button.textContent=currentStopLabel();
  button.classList.add('playing');
  stopTimer=setTimeout(stop,beats*step*1000+650);
}

function simplifyMovementChoices(){
  document.querySelectorAll('.example-helper .btn.secondary').forEach(button=>{
    const text=button.textContent.trim();
    if(labels.rhythm.includes(text))button.remove();
  });
}

const observer=new MutationObserver(()=>simplifyMovementChoices());
observer.observe(document.body,{childList:true,subtree:true});
simplifyMovementChoices();

document.addEventListener('click',e=>{
  const button=e.target.closest?.('.example-helper .btn.secondary');
  if(!button||!labels.soft.includes(button.textContent.trim())&&button!==activeButton)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  if(activeButton===button){stop();return}
  play(button);
},true);

window.addEventListener('pagehide',()=>{observer.disconnect();stop()},{once:true});
window.addEventListener('maria:languagechange',()=>{if(activeButton)activeButton.textContent=currentStopLabel();setTimeout(simplifyMovementChoices,0)});
