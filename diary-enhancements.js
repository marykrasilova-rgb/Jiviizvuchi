import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const s=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb');

const modes=document.querySelector('.modes');
if(modes){
  const guide=document.createElement('button');
  guide.type='button';
  guide.className='surprise-choice';
  guide.innerHTML='<span class="surprise-icon">✦</span><span><strong>Не знаю, что выбрать</strong><small>Дневник предложит способ начать</small></span>';
  modes.before(guide);
  const options=[
    {mode:'voice',text:'Попробуй голос. Не ищи мелодию — начни с одного звука или выдоха.'},
    {mode:'movement',text:'Попробуй движение. Начни с одного жеста и позволь телу продолжить.'},
    {mode:'drawing',text:'Попробуй рисунок. Выбери цвет без объяснений и проведи первую линию.'},
    {mode:'text',text:'Попробуй текст. Начни со слов «Сейчас во мне…» и не редактируй.'}
  ];
  let last=null;
  guide.addEventListener('click',()=>{
    const pool=options.filter(x=>x.mode!==last);
    const pick=pool[Math.floor(Math.random()*pool.length)];
    last=pick.mode;
    const target=document.querySelector(`.mode[data-mode="${pick.mode}"]`);
    target?.click();
    guide.querySelector('strong').textContent='Попробуй: '+target?.querySelector('strong')?.textContent;
    guide.querySelector('small').textContent=pick.text;
    target?.scrollIntoView({behavior:'smooth',block:'center'});
  });
}

const history=document.getElementById('historyView');
// Passwordless authentication: one flow for new and returning users.
const APP_URL='https://mariakrasilovacom.vercel.app/app';
const friendlyAuthError=e=>{
  const m=(e?.message||'').toLowerCase();
  if(m.includes('rate limit'))return 'Слишком много попыток подряд. Подожди немного и попробуй ещё раз.';
  if(m.includes('expired'))return 'Код уже устарел. Нажми «Отправить новый код».';
  if(m.includes('invalid')||m.includes('token'))return 'Код не подошёл. Проверь цифры или запроси новый.';
  if(m.includes('email'))return 'Проверь, правильно ли написан email.';
  return 'Не получилось войти. Попробуй ещё раз.';
};

setTimeout(()=>{
  const email=document.getElementById('email');
  const password=document.getElementById('password');
  const signup=document.getElementById('signupBtn');
  const login=document.getElementById('loginBtn');
  const forgot=document.getElementById('forgotBtn');
  const terms=document.getElementById('acceptTerms');
  const msg=document.getElementById('authMsg');
  if(!email||!signup||!login||!msg)return;

  if(password)password.classList.add('hidden');
  signup.classList.add('hidden');
  login.classList.add('hidden');
  forgot?.classList.add('hidden');

  if(terms&&localStorage.getItem('diaryTermsAccepted')==='1')terms.checked=true;

  const send=document.createElement('button');
  send.id='sendOtpBtn';send.type='button';send.className='btn';send.textContent='Получить код для входа';
  const otpBox=document.createElement('div');otpBox.id='otpBox';otpBox.className='hidden';
  otpBox.innerHTML='<div class="small" style="margin-top:14px">Мы отправили письмо. Введи 6-значный код из письма.</div><input id="otpCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" placeholder="Код из 6 цифр" style="font-size:24px;text-align:center;letter-spacing:.22em"><button id="verifyOtpBtn" type="button" class="btn">Войти в дневник</button><button id="resendOtpBtn" type="button" class="btn secondary">Отправить новый код</button><div class="small" style="margin-top:10px">Если в письме пока пришла кнопка или ссылка вместо цифр — нажми её. Она тоже автоматически откроет дневник.</div>';
  const anchor=terms?.closest('label')||email;
  anchor.after(send,otpBox);

  async function sendCode(){
    const mail=email.value.trim();
    if(!mail||!mail.includes('@')){msg.textContent='Напиши свой email.';email.focus();return}
    if(terms&&!terms.checked){msg.textContent='Чтобы хранить личный дневник, нужно принять Политику конфиденциальности и Условия.';return}
    if(terms?.checked)localStorage.setItem('diaryTermsAccepted','1');
    send.disabled=true;msg.textContent='Отправляю код…';
    const {error}=await s.auth.signInWithOtp({email:mail,options:{shouldCreateUser:true,emailRedirectTo:APP_URL,data:{privacy_accepted:true,terms_accepted:true,privacy_version:'2026-08-29',terms_version:'2026-08-29',marketing_consent:!!document.getElementById('marketingConsent')?.checked,research_consent:!!document.getElementById('researchConsent')?.checked}}});
    send.disabled=false;
    if(error){msg.textContent=friendlyAuthError(error);return}
    localStorage.setItem('diaryLastEmail',mail);
    msg.textContent='Письмо отправлено.';
    otpBox.classList.remove('hidden');
    const code=document.getElementById('otpCode');code?.focus();
  }

  send.onclick=sendCode;
  document.getElementById('resendOtpBtn').onclick=sendCode;
  document.getElementById('verifyOtpBtn').onclick=async()=>{
    const mail=email.value.trim()||localStorage.getItem('diaryLastEmail')||'';
    const code=(document.getElementById('otpCode')?.value||'').replace(/\D/g,'').slice(0,6);
    if(code.length!==6){msg.textContent='Введи 6 цифр из письма.';return}
    const verify=document.getElementById('verifyOtpBtn');verify.disabled=true;msg.textContent='Проверяю код…';
    const {error}=await s.auth.verifyOtp({email:mail,token:code,type:'email'});
    verify.disabled=false;
    if(error){msg.textContent=friendlyAuthError(error);return}
    msg.textContent='Готово.';location.replace('/app');
  };
  document.getElementById('otpCode')?.addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,6);if(e.target.value.length===6)document.getElementById('verifyOtpBtn')?.focus()});
  const remembered=localStorage.getItem('diaryLastEmail');if(remembered&&!email.value)email.value=remembered;
},0);

// Method layer: preserve "Различи" and "Выбери" without sending their text to analytics.
setTimeout(()=>{
  const save=document.getElementById('saveEntry');
  const reflection=document.getElementById('reflection');
  const discern=document.getElementById('discernText');
  const choice=document.getElementById('choiceText');
  if(save&&reflection&&discern&&choice){
    save.addEventListener('click',()=>{
      const r=reflection.value.trim();
      reflection.value=`[[DISCERN]]${discern.value.trim()}[[/DISCERN]][[CHOICE]]${choice.value.trim()}[[/CHOICE]][[REFLECTION]]${r}[[/REFLECTION]]`;
    },true);
  }

  const entries=document.getElementById('entries');
  let decorating=false;
  async function decorateHistory(){
    if(decorating||!entries||!entries.children.length)return;
    decorating=true;
    try{
      const {data:{user}}=await s.auth.getUser();
      if(!user)return;
      const {data}=await s.from('voice_entries').select('discern_text,choice_text').eq('user_id',user.id).order('created_at',{ascending:false}).limit(60);
      const cards=[...entries.querySelectorAll('.entry')];
      (data||[]).forEach((row,i)=>{
        const card=cards[i];if(!card||card.dataset.methodDecorated==='1')return;
        card.dataset.methodDecorated='1';
        if(row.discern_text){const p=document.createElement('p');p.className='small';p.textContent='Что моё: '+row.discern_text;p.dataset.userContent='';card.appendChild(p)}
        if(row.choice_text){const p=document.createElement('p');p.className='small';p.textContent='Мой выбор: '+row.choice_text;p.dataset.userContent='';card.appendChild(p)}
      });
    }finally{decorating=false}
  }
  if(entries){new MutationObserver(()=>setTimeout(decorateHistory,0)).observe(entries,{childList:true});setTimeout(decorateHistory,500)}
  if(history){new MutationObserver(()=>{if(!history.classList.contains('hidden')){setTimeout(decorateHistory,100);if(discern)discern.value='';if(choice)choice.value=''}}).observe(history,{attributes:true,attributeFilter:['class']})}
},0);

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}
