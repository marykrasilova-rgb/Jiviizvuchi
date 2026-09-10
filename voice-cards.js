import './theme-test.js';
import './deep-wave.js';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');
const modes=document.querySelector('.modes');
const voiceButton=document.querySelector('.mode[data-mode="voice"]');

// Keep the safety information prominent but compact on mobile.
const safetyCard=document.querySelector('#appView > .card.flat');
const safetyNotice=safetyCard?.querySelector('.notice');
if(safetyCard&&safetyNotice){
  const details=document.createElement('details');
  details.className='safety-details';
  const summary=document.createElement('summary');
  summary.textContent='Важно о безопасности';
  const body=document.createElement('div');
  body.className='notice';
  body.innerHTML=safetyNotice.innerHTML;
  details.append(summary,body);
  safetyCard.replaceChildren(details);
  safetyCard.classList.add('safety-card');
}

const polish=document.createElement('style');
polish.textContent=`
.safety-details summary{font-weight:850;color:var(--rose);cursor:pointer;list-style:none;padding:2px 0}.safety-details summary::-webkit-details-marker{display:none}.safety-details summary::after{content:'＋';float:right;color:var(--muted)}.safety-details[open] summary::after{content:'−'}.safety-details .notice{margin-top:10px}.focus-welcome h2{margin-top:6px}.focus-welcome{margin-bottom:16px}
.maria-language-switch.diary-language-switch{position:static!important;inset:auto!important;box-shadow:none!important;background:transparent!important;border-color:rgba(118,88,82,.18)!important;margin-left:auto;flex:0 0 auto}.maria-language-switch.diary-language-switch button{min-width:30px!important;min-height:28px!important;padding:5px 7px!important;font-size:11px!important}
.example-helper{margin:12px 0 18px}.example-helper .example-note{background:#f8eeeb;border:1px dashed var(--rose2);border-radius:16px;padding:12px 13px;margin:10px 0}.example-helper .example-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.example-helper .example-actions .btn{margin:0}.example-helper .example-visual{height:76px;border-radius:16px;background:#fff;border:1px solid var(--line);overflow:hidden;position:relative;margin-top:10px}.example-helper .example-stroke{position:absolute;left:10%;top:50%;width:80%;height:3px;background:var(--rose2);border-radius:999px;transform-origin:left center;animation:exampleStroke 2.8s ease-in-out infinite alternate}.example-helper .example-dot{position:absolute;width:16px;height:16px;border-radius:50%;background:var(--rose);left:12%;top:30%;animation:exampleDot 3.3s ease-in-out infinite alternate}.example-helper .example-status{min-height:20px;margin-top:8px}.example-helper .skip-example{margin-top:8px;text-align:center;width:100%}.example-helper .btn.playing{background:var(--olive);color:#fff}
@keyframes exampleStroke{0%{transform:rotate(-9deg) scaleX(.55);border-radius:999px}100%{transform:rotate(12deg) scaleX(1)}}@keyframes exampleDot{0%{transform:translate(0,0) scale(.85)}100%{transform:translate(300px,20px) scale(1.15)}}
@media(max-width:640px){.safety-card{padding:11px 13px;margin:8px 0 18px;border-radius:18px}.safety-details .notice{font-size:12px;line-height:1.5}.nav{padding:5px 8px calc(5px + env(safe-area-inset-bottom))}.nav button{padding:8px 4px;font-size:13px}.shell{padding-bottom:96px}.focus-welcome{padding:16px;margin:8px 0 16px}.focus-welcome h2{font-size:22px}.focus-welcome .small{font-size:12.5px}.top{gap:7px}.top .brand{font-size:11px}.maria-language-switch.diary-language-switch button{min-width:27px!important;padding:5px 6px!important}.maria-language-switch.diary-language-switch button[data-site-lang="he"]{min-width:42px!important}.example-helper .example-actions{grid-template-columns:1fr}.example-helper .example-dot{animation-name:exampleDotMobile}}@keyframes exampleDotMobile{0%{transform:translate(0,0) scale(.85)}100%{transform:translate(190px,20px) scale(1.15)}}
`;
document.head.appendChild(polish);

function dockLanguageSwitcher(){
  const switcher=document.querySelector('.maria-language-switch');
  const top=document.querySelector('.top');
  const logout=document.getElementById('logoutBtn');
  if(!switcher||!top||switcher.classList.contains('diary-language-switch'))return false;
  switcher.classList.add('diary-language-switch');
  top.insertBefore(switcher,logout||null);
  return true;
}
if(!dockLanguageSwitcher()){
  const observer=new MutationObserver(()=>{if(dockLanguageSwitcher())observer.disconnect()});
  observer.observe(document.body,{childList:true,subtree:true});
}

const copy={
  ru:{
    label:'Если трудно начать',title:'Хочешь пример — без «как правильно»?',
    note:'Это не образец. Не нужно повторять точно, красиво или похоже. Пример нужен только как разрешение начать. Если он мешает — пропусти его.',
    voice:'Звуковой импульс',movementSoft:'Мягкий пульс',movementBeat:'Ритм',drawing:'Показать движение линии',text:'Показать одну фразу',stop:'Остановить',skip:'Без примера — начну по-своему',
    voiceStatus:'Послушай контур и ответь своим звуком. Не копируй точно.',movementStatus:'Пусть тело само решит, что делать с пульсом. Можно двигаться совсем мало.',drawingStatus:'Это только один случайный жест. Нарисуй иначе.',textStatus:'«Сейчас во мне есть…» — продолжи как угодно или вообще не используй эту фразу.'
  },
  en:{
    label:'If starting feels hard',title:'Want an example — without a “right way”?',
    note:'This is not a model to copy. You do not need to match it, sound good, or do it correctly. It is only permission to begin. If it gets in the way, skip it.',
    voice:'Sound prompt',movementSoft:'Soft pulse',movementBeat:'Rhythm',drawing:'Show a moving line',text:'Show one sentence',stop:'Stop',skip:'No example — I’ll start my own way',
    voiceStatus:'Listen to the contour, then answer with your own sound. Do not copy it exactly.',movementStatus:'Let your body decide what to do with the pulse. Even a tiny movement is enough.',drawingStatus:'This is only one random gesture. Make yours different.',textStatus:'“Right now there is…” — continue any way you want, or ignore this sentence completely.'
  },
  he:{
    label:'אם קשה להתחיל',title:'רוצה דוגמה — בלי “איך נכון”?',
    note:'זו לא דוגמה שצריך לחקות. לא צריך לעשות בדיוק, יפה או נכון. היא רק נותנת רשות להתחיל. אם היא מפריעה — אפשר לדלג.',
    voice:'דחף קולי',movementSoft:'פעימה רכה',movementBeat:'קצב',drawing:'להראות תנועת קו',text:'להראות משפט אחד',stop:'לעצור',skip:'בלי דוגמה — אתחיל בדרך שלי',
    voiceStatus:'הקשיבו לקו הצלילי ואז ענו בקול שלכם. אין צורך לחקות בדיוק.',movementStatus:'תנו לגוף להחליט מה לעשות עם הפעימה. גם תנועה קטנה מספיקה.',drawingStatus:'זו רק מחווה מקרית אחת. ציירו אחרת.',textStatus:'״כרגע יש בי…״ — המשיכו בכל דרך שתרצו, או התעלמו מהמשפט לגמרי.'
  }
};
const lang=()=>window.MariaLanguage?.getCurrent?.()||document.documentElement.lang||'ru';
const t=key=>(copy[lang()]||copy.ru)[key]||copy.ru[key]||key;

let audioCtx=null;
let scheduled=[];
let activeAudioButton=null;
function stopPromptAudio(){
  scheduled.forEach(node=>{try{node.stop()}catch{}});scheduled=[];
  if(audioCtx){try{audioCtx.close()}catch{}audioCtx=null}
  if(activeAudioButton){activeAudioButton.classList.remove('playing');activeAudioButton.textContent=activeAudioButton.dataset.original||activeAudioButton.textContent;activeAudioButton=null}
}
function tone(ctx,when,freq,duration,gain=0.06,type='sine'){
  const osc=ctx.createOscillator(),g=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,when);g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(gain,when+.03);g.gain.exponentialRampToValueAtTime(.0001,when+duration);
  osc.connect(g).connect(ctx.destination);osc.start(when);osc.stop(when+duration+.05);scheduled.push(osc);
}
function playVoicePrompt(button){
  stopPromptAudio();
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  const now=audioCtx.currentTime+.08;
  [[196,1.0],[233,1.1],[174,1.25],[220,1.0]].forEach((x,i)=>tone(audioCtx,now+i*1.05,x[0],x[1],.055,'sine'));
  activeAudioButton=button;button.dataset.original=t('voice');button.textContent=t('stop');button.classList.add('playing');
  setTimeout(()=>stopPromptAudio(),4800);
}
function playMovementPrompt(button,kind){
  stopPromptAudio();
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  const now=audioCtx.currentTime+.08;
  const bpm=kind==='soft'?72:104;const step=60/bpm;const beats=kind==='soft'?24:32;
  tone(audioCtx,now,110,beats*step+.4,.018,'sine');
  for(let i=0;i<beats;i++){
    const strong=i%4===0;const freq=kind==='soft'?(strong?164:220):(strong?110:330);
    tone(audioCtx,now+i*step,freq,kind==='soft'?.32:.12,strong?.045:.022,kind==='soft'?'sine':'triangle');
    if(kind==='beat'&&i%2===1)tone(audioCtx,now+i*step+.02,660,.06,.012,'square');
  }
  activeAudioButton=button;button.dataset.original=kind==='soft'?t('movementSoft'):t('movementBeat');button.textContent=t('stop');button.classList.add('playing');
  setTimeout(()=>stopPromptAudio(),beats*step*1000+500);
}

if(modes){
  const example=document.createElement('div');
  example.className='card example-helper hidden';
  example.innerHTML='<div class="label example-label"></div><h3 class="example-title"></h3><div class="example-note small"></div><div class="example-actions"></div><div class="example-status small"></div><button type="button" class="linkbtn skip-example"></button>';
  modes.after(example);
  const label=example.querySelector('.example-label'),title=example.querySelector('.example-title'),note=example.querySelector('.example-note'),actions=example.querySelector('.example-actions'),status=example.querySelector('.example-status'),skip=example.querySelector('.skip-example');
  let currentMode=null;

  function renderExample(mode){
    currentMode=mode;stopPromptAudio();example.classList.remove('hidden');
    label.textContent=t('label');title.textContent=t('title');note.textContent=t('note');skip.textContent=t('skip');status.textContent='';actions.replaceChildren();
    if(mode==='voice'){
      const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=t('voice');b.onclick=()=>activeAudioButton===b?stopPromptAudio():(playVoicePrompt(b),status.textContent=t('voiceStatus'));actions.append(b);
    }else if(mode==='movement'){
      ['soft','beat'].forEach(kind=>{const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=kind==='soft'?t('movementSoft'):t('movementBeat');b.onclick=()=>activeAudioButton===b?stopPromptAudio():(playMovementPrompt(b,kind),status.textContent=t('movementStatus'));actions.append(b)});
    }else if(mode==='drawing'){
      const visual=document.createElement('div');visual.className='example-visual';visual.innerHTML='<div class="example-stroke"></div><div class="example-dot"></div>';const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=t('drawing');b.onclick=()=>{visual.classList.toggle('hidden');status.textContent=t('drawingStatus')};actions.append(b,visual);
    }else if(mode==='text'){
      const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=t('text');b.onclick=()=>{status.textContent=t('textStatus')};actions.append(b);
    }
  }
  document.querySelectorAll('.mode').forEach(modeButton=>modeButton.addEventListener('click',()=>renderExample(modeButton.dataset.mode)));
  skip.addEventListener('click',()=>{stopPromptAudio();example.classList.add('hidden')});
  window.addEventListener('maria:languagechange',()=>{if(currentMode&&!example.classList.contains('hidden'))renderExample(currentMode)});
}

if(modes&&voiceButton){
  const wrap=document.createElement('div');
  wrap.className='card voice-card-helper hidden';
  wrap.style.margin='14px 0 18px';
  const label=document.createElement('div');
  label.className='label';
  label.textContent='Карточки для голоса';
  const title=document.createElement('h3');
  title.textContent='Нужен импульс для импровизации?';
  const description=document.createElement('p');
  description.className='small';
  description.textContent='Вытяни случайную карточку — или импровизируй свободно.';
  const instruction=document.createElement('p');
  instruction.className='small';
  const actions=document.createElement('div');
  actions.className='canvasbar';
  const button=document.createElement('button');
  button.type='button';
  button.className='btn secondary';
  button.textContent='Вытянуть карточку';
  actions.append(button);
  wrap.append(label,title,description,instruction,actions);
  const example=document.querySelector('.example-helper');
  (example||modes).after(wrap);

  document.querySelectorAll('.mode').forEach(modeButton=>modeButton.addEventListener('click',()=>{
    wrap.classList.toggle('hidden',modeButton.dataset.mode!=='voice');
  }));

  let cards=[];
  let lastId=null;

  async function loadCards(){
    if(cards.length)return cards;
    const {data,error}=await s.from('practices').select('id,title,description,instruction,duration_seconds').eq('is_active',true);
    if(error){
      description.textContent='Не удалось загрузить карточки. Можно начать голосом без неё.';
      return [];
    }
    cards=data||[];
    return cards;
  }

  async function drawCard(){
    button.disabled=true;
    const list=await loadCards();
    button.disabled=false;
    if(!list.length)return;
    const pool=list.length>1?list.filter(x=>x.id!==lastId):list;
    const card=pool[Math.floor(Math.random()*pool.length)];
    lastId=card.id;
    title.textContent=card.title;
    description.textContent=card.description||'';
    instruction.textContent=card.instruction||'';
    button.textContent='Ещё карточку';
    if(!voiceButton.classList.contains('on'))voiceButton.click();
    wrap.scrollIntoView({behavior:'smooth',block:'center'});
  }

  button.addEventListener('click',drawCard);
}
