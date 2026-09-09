import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const supabase=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
const FIRST_KEY='maria_diary_first_seen';
const LAST_KEY='maria_diary_last_seen';
const STARTED_KEY='maria_diary_practice_started';
const CAMPAIGN_KEY='maria_diary_campaign';

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
  const app=$('appView');
  if(!app)return;
  const box=document.createElement('div');
  box.id='focusWelcome';
  box.className='card';
  box.style.marginBottom='18px';
  box.innerHTML='<div class="label">Первый раз здесь?</div><h2 style="margin-top:6px">Одна практика — примерно 3–7 минут</h2><p class="small">1. Заметьте состояние. 2. Выберите голос, движение, рисунок или текст. 3. Снова отметьте состояние и сохраните запись. Здесь нет правильного результата.</p><button id="focusStart" class="btn">Начать первую практику</button>';
  app.insertBefore(box,app.firstChild);
  $('focusStart')?.addEventListener('click',()=>{
    box.remove();
    document.getElementById('practiceView')?.scrollIntoView({behavior:'smooth',block:'start'});
    track('onboarding_completed');
    localStorage.setItem(FIRST_KEY,new Date().toISOString());
  });
  track('onboarding_shown');
}

async function onSignedIn(){
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
