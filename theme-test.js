import './he-complete.js';
const themes={
  plum:{label:'Слива',bg:'#f7f1ee',paper:'#fffdfb',text:'#2f2928',muted:'#756b67',rose:'#6f3f5b',rose2:'#9a6a84',olive:'#75806d',line:'#e5d9d5'},
  sage:{label:'Шалфей',bg:'#f2f5f1',paper:'#fffefb',text:'#29312d',muted:'#6f7872',rose:'#667c70',rose2:'#8fa296',olive:'#667c70',line:'#dbe4dc'},
  indigo:{label:'Индиго',bg:'#f2f3f7',paper:'#fffefe',text:'#292b35',muted:'#6d7080',rose:'#414765',rose2:'#727a9a',olive:'#68736b',line:'#dcdeea'},
  terra:{label:'Терракота',bg:'#f7f1ec',paper:'#fffdfa',text:'#342b27',muted:'#7a6c65',rose:'#a65f4b',rose2:'#c78a79',olive:'#7c8068',line:'#e8d8cf'}
};

const key='maria-diary-theme';
const defaultTheme=localStorage.getItem(key)||'plum';

function applyTheme(name){
  const t=themes[name]||themes.plum;
  const root=document.documentElement;
  root.dataset.theme=name;
  Object.entries(t).forEach(([k,v])=>{if(k!=='label')root.style.setProperty(`--${k}`,v)});
  localStorage.setItem(key,name);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute('content',t.bg);
  document.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('on',b.dataset.themeChoice===name));
  window.dispatchEvent(new CustomEvent('maria:themechange',{detail:{theme:name,color:t.rose}}));
}

function buildSwitcher(){
  if(document.getElementById('themeTester'))return;
  const host=document.createElement('div');
  host.id='themeTester';
  host.className='theme-tester';
  const title=document.createElement('div');
  title.className='theme-tester-title';
  title.textContent='Цвет приложения';
  const row=document.createElement('div');
  row.className='theme-tester-row';
  Object.entries(themes).forEach(([name,t])=>{
    const b=document.createElement('button');
    b.type='button';
    b.dataset.themeChoice=name;
    b.className='theme-choice';
    b.innerHTML=`<span class="theme-dot" style="background:${t.rose}"></span><span>${t.label}</span>`;
    b.addEventListener('click',()=>applyTheme(name));
    row.appendChild(b);
  });
  host.append(title,row);
  const top=document.querySelector('.top');
  (top?.parentElement||document.querySelector('.shell')||document.body).insertBefore(host,top?.nextSibling||null);
  applyTheme(defaultTheme);
  window.MariaLanguage?.refresh?.();
}

applyTheme(defaultTheme);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildSwitcher,{once:true});else buildSwitcher();

window.MariaThemeTest={applyTheme,themes,getCurrent:()=>document.documentElement.dataset.theme||defaultTheme};
