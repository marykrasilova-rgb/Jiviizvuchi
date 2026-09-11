import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const supabase=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
const FIRST_KEY='maria_diary_first_seen';
const LAST_KEY='maria_diary_last_seen';
const STARTED_KEY='maria_diary_practice_started';
const CAMPAIGN_KEY='maria_diary_campaign';
let signedInHandled=false;

function campaign(){
  const p=new URLSearchParams(location.search);
  const c={
    source:p.get('utm_source')||null,
    medium:p.get('utm_medium')||null,
    campaign:p.get('utm_campaign')||p.get('focus')||null,
    content:p.get('utm_content')||null
  };
  if(Object.values(c).some(Boolean)) localStorage.setItem(CAMPAIGN_KEY,JSON.stringify(c));
  try{return JSON.parse(localStorage.getItem(CAMPAIGN_KEY)||'{}')}catch{return {}}
}

async function track(event_name,extra={}){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return;
  const metadata={...campaign(),page:'diary',...extra};
  await supabase.from('usage_events').insert({user_id:user.id,event_name,modality:extra.modality||null,metadata});
}

function addWelcome(){
  if(localStorage.getItem(FIRST_KEY))return;
  if(document.getElementById('focusWelcome'))return;
  const app=$('appView');
  if(!app)return;
  const box=document.createElement('div');
  box.id='focusWelcome';
  box.className='card focus-welcome';
  box.innerHTML='<div class="label">Первый раз здесь?</div><h2>Одна практика — примерно 3–7 минут</h2><p class="small"><b>Заметь → Создай → Заметь снова → Различи → Выбери.</b><br>Сначала отметь состояние, затем дай ему форму голосом, движением, рисунком или текстом. После — посмотри, что изменилось, что здесь твоё и какой маленький выбор хочется сделать. Здесь нет правильного результата.</p><button id="focusStart" class="btn">Начать первую практику</button>';
  const practice=document.getElementById('practiceView');
  app.insertBefore(box,practice||app.firstChild);
  $('focusStart')?.addEventListener('click',()=>{
    localStorage.setItem(FIRST_KEY,new Date().toISOString());
    box.remove();
    practice?.scrollIntoView({behavior:'smooth',block:'start'});
    track('onboarding_completed');
  });
  track('onboarding_shown');
}

async function onSignedIn(){
  if(signedInHandled)return;
  signedInHandled=true;
  const now=new Date();
  const last=localStorage.getItem(LAST_KEY);
  await track('focus_session_open');
  if(last){
    const prev=new Date(last);
    if(prev.toDateString()!==now.toDateString()) await track('return_visit',{days_since_last:Math.max(1,Math.round((now-prev)/86400000))});
  }else{
    await track('first_authenticated_visit');
  }
  localStorage.setItem(LAST_KEY,now.toISOString());
  addWelcome();
}

let signupPending=false;
$('signupBtn')?.addEventListener('click',()=>{signupPending=true;localStorage.setItem('maria_diary_signup_pending','1')});
$('loginBtn')?.addEventListener('click',()=>localStorage.setItem('maria_diary_login_pending','1'));
$('forgotBtn')?.addEventListener('click',()=>track('password_reset_clicked'));

document.querySelectorAll('.mode').forEach(btn=>btn.addEventListener('click',()=>{
  const key=new Date().toISOString().slice(0,10);
  if(sessionStorage.getItem(STARTED_KEY)!==key){
    sessionStorage.setItem(STARTED_KEY,key);
    track('practice_started',{modality:btn.dataset.mode||null});
  }
}));

$('saveEntry')?.addEventListener('click',()=>track('save_clicked'));
document.querySelector('[data-view="history"]')?.addEventListener('click',()=>track('history_opened'));
document.querySelector('[data-view="about"]')?.addEventListener('click',()=>track('about_opened'));

supabase.auth.onAuthStateChange(async(event,session)=>{
  if(!session?.user)return;
  if(event==='SIGNED_IN'){
    if(signupPending||localStorage.getItem('maria_diary_signup_pending')){
      await track('signup_completed');
      signupPending=false;localStorage.removeItem('maria_diary_signup_pending');
    }else if(localStorage.getItem('maria_diary_login_pending')){
      await track('login_completed');
      localStorage.removeItem('maria_diary_login_pending');
    }
    onSignedIn();
  }
});

supabase.auth.getUser().then(({data:{user}})=>{if(user)onSignedIn()});

// Movement mode: keep one pulse only. The optional example card is hidden for movement,
// and the main pulse uses an HTMLAudio loop (more reliable on iPhone than live oscillators).
let singlePulseMinutes=3;
let singlePulseAudio=null;
let singlePulseTimer=null;
let singlePulseUrl=null;

function makeSinglePulseUrl(){
  if(singlePulseUrl)return singlePulseUrl;
  const rate=16000,bpm=72,beat=60/bpm,beats=4,dur=beat*beats,n=Math.floor(rate*dur);
  const buffer=new ArrayBuffer(44+n*2),v=new DataView(buffer);
  const put=(o,t)=>{for(let i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i))};
  put(0,'RIFF');v.setUint32(4,36+n*2,true);put(8,'WAVE');put(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);put(36,'data');v.setUint32(40,n*2,true);
  const root=275,third=343.75,fifth=412.5;
  for(let i=0;i<n;i++){
    const t=i/rate,within=t%beat,attack=.055,release=.62;
    let env=0;
    if(within<attack)env=within/attack;
    else if(within<release)env=Math.pow(1-(within-attack)/(release-attack),1.45);
    const shimmer=.94+.06*Math.sin(2*Math.PI*.18*t);
    let x=env*shimmer*(.56*Math.sin(2*Math.PI*root*t)+.20*Math.sin(2*Math.PI*third*t)+.28*Math.sin(2*Math.PI*fifth*t));
    x=Math.max(-1,Math.min(1,x*.78));
    v.setInt16(44+i*2,Math.round(x*32767),true);
  }
  singlePulseUrl=URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));
  return singlePulseUrl;
}

function stopSinglePulse(done=false){
  if(singlePulseTimer){clearTimeout(singlePulseTimer);singlePulseTimer=null}
  if(singlePulseAudio){singlePulseAudio.pause();try{singlePulseAudio.currentTime=0}catch{}}
  const b=$('movementPulse'),st=$('movementPulseStatus');
  if(b)b.textContent='▶ Включить пульс';
  if(st)st.textContent=done?'Готово':`Выбрано: ${singlePulseMinutes} мин · 250–300 Гц + терция + квинта`;
}

async function startSinglePulse(){
  if(singlePulseTimer){stopSinglePulse(false);return}
  const b=$('movementPulse'),st=$('movementPulseStatus');
  try{
    if(!singlePulseAudio){
      singlePulseAudio=new Audio(makeSinglePulseUrl());
      singlePulseAudio.loop=true;
      singlePulseAudio.preload='auto';
      singlePulseAudio.volume=.95;
      singlePulseAudio.playsInline=true;
    }
    singlePulseAudio.muted=false;
    singlePulseAudio.currentTime=0;
    await singlePulseAudio.play();
    singlePulseTimer=setTimeout(()=>stopSinglePulse(true),singlePulseMinutes*60*1000);
    if(b)b.textContent='■ Выключить пульс';
    if(st)st.textContent=`Звучит ${singlePulseMinutes} мин · 250–300 Гц + терция + квинта`;
  }catch(e){
    singlePulseTimer=null;
    if(st)st.textContent='Не удалось включить звук. Проверь громкость телефона и нажми ещё раз.';
  }
}

function installSingleMovementPulse(){
  const pulse=$('movementPulse');
  if(!pulse)return;
  pulse.textContent='▶ Включить пульс';
  pulse.onclick=startSinglePulse;
  document.querySelectorAll('#movementPulseDurations [data-pulse-minutes]').forEach(btn=>btn.addEventListener('click',()=>{
    singlePulseMinutes=+btn.dataset.pulseMinutes||3;
    if(!singlePulseTimer)$('movementPulseStatus').textContent=`Выбрано: ${singlePulseMinutes} мин · 250–300 Гц + терция + квинта`;
  }));
  document.querySelectorAll('.mode').forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.mode==='movement')setTimeout(()=>document.querySelector('.example-helper')?.classList.add('hidden'),0);
    else if(singlePulseTimer)stopSinglePulse(false);
  }));
  if($('movementPulseStatus'))$('movementPulseStatus').textContent='Выбрано: 3 мин · 250–300 Гц + терция + квинта';
}

installSingleMovementPulse();
