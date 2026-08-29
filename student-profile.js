const PROFILE_KEY='musicStudentProfile';
const profileAvatars=['🎹','🎵','⭐','🐱','🦋','🌈'];
let studentProfile={name:'',avatar:'🎹',hero:'yosik'};
try{const saved=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');if(saved&&typeof saved==='object')studentProfile={...studentProfile,...saved}}catch(e){}

function saveStudentProfile(){localStorage.setItem(PROFILE_KEY,JSON.stringify(studentProfile));renderStudentProfile()}
function heroName(){return studentProfile.hero==='lili'?'Лили':'Йосик'}
function renderStudentProfile(){
 const chip=document.getElementById('studentChip');if(chip){chip.innerHTML=`<span>${studentProfile.avatar}</span><strong>${studentProfile.name||'Игрок'}</strong><small>с ${heroName()}</small>`}
 document.querySelectorAll('[data-hero]').forEach(b=>b.classList.toggle('on',b.dataset.hero===studentProfile.hero));
 document.querySelectorAll('[data-avatar]').forEach(b=>b.classList.toggle('on',b.dataset.avatar===studentProfile.avatar));
 const input=document.getElementById('studentName');if(input&&document.activeElement!==input)input.value=studentProfile.name||'';
}
function openProfile(){document.getElementById('profileModal')?.classList.add('show');renderStudentProfile()}
function closeProfile(){document.getElementById('profileModal')?.classList.remove('show')}

document.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('studentChip')?.addEventListener('click',openProfile);
 document.getElementById('profileClose')?.addEventListener('click',closeProfile);
 document.getElementById('profileModal')?.addEventListener('click',e=>{if(e.target.id==='profileModal')closeProfile()});
 document.querySelectorAll('[data-hero]').forEach(b=>b.onclick=()=>{studentProfile.hero=b.dataset.hero;saveStudentProfile()});
 document.querySelectorAll('[data-avatar]').forEach(b=>b.onclick=()=>{studentProfile.avatar=b.dataset.avatar;saveStudentProfile()});
 document.getElementById('saveProfile')?.addEventListener('click',()=>{const value=(document.getElementById('studentName')?.value||'').trim().slice(0,24);studentProfile.name=value;saveStudentProfile();closeProfile()});
 renderStudentProfile();
 if(!localStorage.getItem(PROFILE_KEY))setTimeout(openProfile,450);
});