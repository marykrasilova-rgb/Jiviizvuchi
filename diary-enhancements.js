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
if(history){
  const weekly=document.createElement('div');
  weekly.className='card weekly-voice';
  weekly.innerHTML='<div class="label">Неделя в голосе</div><h2>Услышать себя во времени</h2><p class="small">Голосовые следы последних 7 дней — один за другим. Без анализа и оценок.</p><div id="weeklyVoiceList" class="weekly-list"><span class="small">Загружаю…</span></div>';
  const stats=document.getElementById('stats');
  stats?.after(weekly);

  async function loadWeek(){
    const box=document.getElementById('weeklyVoiceList');
    if(!box)return;
    const {data:{user}}=await s.auth.getUser();
    if(!user)return;
    const since=new Date(Date.now()-7*86400000).toISOString();
    const {data,error}=await s.from('voice_entries').select('id,created_at,expression_media_path,audio_path_before,modality').eq('user_id',user.id).gte('created_at',since).order('created_at',{ascending:true});
    if(error){box.innerHTML='<span class="small">Не удалось собрать неделю.</span>';return}
    const voices=(data||[]).filter(x=>(x.modality==='voice'||x.audio_path_before)&&(x.expression_media_path||x.audio_path_before));
    box.replaceChildren();
    if(!voices.length){box.innerHTML='<span class="small">Когда появятся голосовые записи, здесь сложится твоя первая звуковая неделя.</span>';return}
    for(const [i,x] of voices.entries()){
      const path=x.expression_media_path||x.audio_path_before;
      const {data:u}=await s.storage.from('voice-recordings').createSignedUrl(path,1800);
      if(!u?.signedUrl)continue;
      const item=document.createElement('div');item.className='weekly-item';
      const meta=document.createElement('div');meta.className='weekly-meta';meta.textContent=`${i+1}. ${new Date(x.created_at).toLocaleDateString('ru-RU',{weekday:'short',day:'numeric',month:'short'})}`;
      const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=u.signedUrl;
      item.append(meta,audio);box.appendChild(item);
    }
    const players=[...box.querySelectorAll('audio')];
    players.forEach((p,i)=>p.addEventListener('ended',()=>players[i+1]?.play().catch(()=>{})));
  }
  s.auth.onAuthStateChange((_e,session)=>{if(session?.user)setTimeout(loadWeek,0)});
  loadWeek();
}

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

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}
