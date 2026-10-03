from pathlib import Path
import re

# Visible explanatory copy: the current production email sends a magic link.
hp = Path('diary.html')
h = hp.read_text(encoding='utf-8')
old = 'Первый вход и возвращение в дневник — по коду из письма, без пароля. Если ты здесь впервые, аккаунт создастся после подтверждения email.'
new = 'Первый вход и возвращение в дневник — по одноразовой ссылке из письма, без пароля. Если ты здесь впервые, аккаунт создастся после подтверждения email.'
if old in h:
    h = h.replace(old, new, 1)
hp.write_text(h, encoding='utf-8')

# Login UX: prevent repeated requests from hitting the provider rate limit.
jp = Path('diary-enhancements.js')
s = jp.read_text(encoding='utf-8')
s = s.replace(
    "if(m.includes('rate limit'))return 'Слишком много попыток подряд. Подожди немного и попробуй ещё раз.';",
    "if(m.includes('rate limit'))return 'Письмо уже запрашивали недавно. Подожди около минуты и попробуй снова.';"
)

old_block = """  let authBusy=false, sentEmail='';
  async function sendCode(){
    if(authBusy)return;
"""
new_block = """  let authBusy=false, sentEmail='', cooldownUntil=0, cooldownTimer=null;
  function startCooldown(seconds=60){
    cooldownUntil=Date.now()+seconds*1000;
    clearInterval(cooldownTimer);
    const resend=document.getElementById('resendOtpBtn');
    const tick=()=>{
      const left=Math.max(0,Math.ceil((cooldownUntil-Date.now())/1000));
      if(left>0){
        send.disabled=true;
        if(resend)resend.disabled=true;
        send.textContent='Повторить через '+left+' с';
        if(resend)resend.textContent='Отправить снова через '+left+' с';
      }else{
        clearInterval(cooldownTimer);cooldownTimer=null;
        send.disabled=false;
        send.textContent='Получить ссылку для входа';
        if(resend){resend.disabled=false;resend.textContent='Отправить новую ссылку'}
      }
    };
    tick();cooldownTimer=setInterval(tick,1000);
  }
  async function sendCode(){
    if(authBusy)return;
    const wait=Math.ceil((cooldownUntil-Date.now())/1000);
    if(wait>0){msg.textContent='Письмо уже отправлено. Подожди '+wait+' с перед повторной отправкой.';return}
"""
if old_block not in s:
    raise SystemExit('Auth block anchor not found')
s = s.replace(old_block, new_block, 1)

s = s.replace(
    "if(error){msg.textContent=friendlyAuthError(error);return}",
    "if(error){msg.textContent=friendlyAuthError(error);if((error.message||'').toLowerCase().includes('rate limit'))startCooldown(60);return}",
    1
)
s = s.replace(
    "otpBox.classList.remove('hidden');\n    const code=document.getElementById('otpCode');if(code){code.value='';code.focus()}",
    "otpBox.classList.remove('hidden');\n    startCooldown(60);\n    const code=document.getElementById('otpCode');if(code){code.value=''}",
    1
)
s = s.replace(
    "}catch(e){msg.textContent='Не удалось связаться с сервером. Проверь интернет и попробуй ещё раз.'}finally{authBusy=false;send.disabled=false;document.getElementById('resendOtpBtn').disabled=false}",
    "}catch(e){msg.textContent='Не удалось связаться с сервером. Проверь интернет и попробуй ещё раз.'}finally{authBusy=false;if(Date.now()>=cooldownUntil){send.disabled=false;document.getElementById('resendOtpBtn').disabled=false}}",
    1
)
jp.write_text(s, encoding='utf-8')

# Invalidate cached PWA shell so iPhone/Safari sees the new login code.
sp = Path('sw.js')
sw = sp.read_text(encoding='utf-8')
sw = re.sub(r"const CACHE='maria-diary-v\d+';", "const CACHE='maria-diary-v11';", sw, count=1)
sp.write_text(sw, encoding='utf-8')
