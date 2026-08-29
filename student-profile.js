const PROFILE_KEY='musicStudentProfile';
const profileAvatars=['🎹','🎵','⭐','🐱','🦋','🌈'];
let studentProfile={name:'',avatar:'🎹',hero:'yosik'};
try{const saved=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');if(saved&&typeof saved==='object')studentProfile={...studentProfile,...saved}}catch(e){}
const HERO_TEXT={
 ru:{yosik:'Пианист Йосиф',lili:'Пианистка Лиля',with:'с',player:'Игрок'},
 he:{yosik:'הפסנתרן יוסף',lili:'הפסנתרנית ליליה',with:'עם',player:'שחקן'},
 en:{yosik:'Pianist Joseph',lili:'Pianist Lilia',with:'with',player:'Player'}
};
function profileLang(){return typeof gameLang!=='undefined'?gameLang:(localStorage.getItem('musicGameLang')||'ru')}
function heroText(){return HERO_TEXT[profileLang()]||HERO_TEXT.ru}
function saveStudentProfile(){localStorage.setItem(PROFILE_KEY,JSON.stringify(studentProfile));renderStudentProfile()}
function heroName(){return heroText()[studentProfile.hero]}
function renderStudentProfile(){
 const t=heroText(),chip=document.getElementById('studentChip');if(chip){chip.innerHTML=`<span>${studentProfile.avatar}</span><strong>${studentProfile.name||t.player}</strong><small>${t.with} ${heroName()}</small>`}
 document.querySelectorAll('[data-hero]').forEach(b=>{b.classList.toggle('on',b.dataset.hero===studentProfile.hero);const label=b.querySelector('b');if(label)label.textContent=t[b.dataset.hero]});
 const friends=document.querySelectorAll('.hero-friends .friend');if(friends[0])friends[0].querySelector('b').textContent=t.yosik;if(friends[1])friends[1].querySelector('b').textContent=t.lili;
 document.querySelectorAll('[data-avatar]').forEach(b=>b.classList.toggle('on',b.dataset.avatar===studentProfile.avatar));
 const input=document.getElementById('studentName');if(input&&document.activeElement!==input)input.value=studentProfile.name||'';
}
function openProfile(){document.getElementById('profileModal')?.classList.add('show');renderStudentProfile()}
function closeProfile(){document.getElementById('profileModal')?.classList.remove('show')}
document.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('studentChip')?.addEventListener('click',openProfile);document.getElementById('profileClose')?.addEventListener('click',closeProfile);document.getElementById('profileModal')?.addEventListener('click',e=>{if(e.target.id==='profileModal')closeProfile()});
 document.querySelectorAll('[data-hero]').forEach(b=>b.onclick=()=>{studentProfile.hero=b.dataset.hero;saveStudentProfile()});document.querySelectorAll('[data-avatar]').forEach(b=>b.onclick=()=>{studentProfile.avatar=b.dataset.avatar;saveStudentProfile()});
 document.getElementById('saveProfile')?.addEventListener('click',()=>{const value=(document.getElementById('studentName')?.value||'').trim().slice(0,24);studentProfile.name=value;saveStudentProfile();closeProfile()});renderStudentProfile();if(!localStorage.getItem(PROFILE_KEY))setTimeout(openProfile,450);
});
// Language switch also refreshes character names immediately.
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setTimeout(renderStudentProfile,0)));