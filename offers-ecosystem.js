/* Мария Красилова: ненавязчивые переходы между программами и афиши живых событий.
   Ссылки FB даны автором по порядку: первая — ХОЧУХА, вторая — концерт. */
(function () {
  'use strict';
  const pathname=location.pathname.replace(/\/$/,'')||'/';
  const excluded=['/diary','/diary.html','/app.html','/piano-school.html','/piano-practice.html','/games','/games.html','/emotional-diary.html','/echo.html','/focus-dashboard.html'];
  if(excluded.includes(pathname))return;
  const p=pathname.toLowerCase();
  const supported=new Set([
    '/','/index.html','/golos-bez-straha.html','/zhivi-i-zvuchi.html',
    '/3-praktiki-golosa.html','/guide-how-to-stop-being-shy-of-your-voice.html',
    '/music-improvisation-adults.html','/vocal-improvisation.html','/vocal-haifa.html',
    '/maria-krasilova.html','/haifa.html'
  ]);
  if(!supported.has(p) && !p.startsWith('/articles/'))return;

  const EVENT_LINKS=Object.freeze({
    fairy:'https://www.facebook.com/share/1KNoQgFwvo/?mibextid=wwXIfr',
    concert:'https://www.facebook.com/share/19WWbcRTVZ/?mibextid=wwXIfr'
  });
  const events=[
    {id:'fairy',date:'2026-10-31',url:EVENT_LINKS.fairy,kicker:['31 октября · интенсив-перформанс','31 October · creative performance day','31 באוקטובר · סדנת יצירה והופעה'],title:['Музыкальная сказка твоей ХОЧУХИ','The musical fairy tale of your wishes','האגדה המוזיקלית של הרצונות שלך'],description:['Один день, чтобы выразить собственную историю и вместе создать мини-спектакль.','A creative day to bring your story to the stage in a small shared performance.','יום יצירתי לספר את הסיפור שלך וליצור מופע משותף.']},
    {id:'concert',date:'2026-11-12',url:EVENT_LINKS.concert,kicker:['12 ноября · концерт · Хайфа','12 November · concert · Haifa','12 בנובמבר · מופע · חיפה'],title:['Бабоньки гуляют','Babonki Gulyayut · concert','באבונקי גוליאיוט · מופע'],description:['Женские истории с юмором: стихи Кати Алюровой и авторская музыка Марии Красиловой.','Women’s stories, humor, poetry by Katya Alyurova and music by Maria Krasilova.','סיפורי נשים בהומור: שירה של קטיה אליורובה ומוזיקה של מריה קרסילובה.']}
  ];
  const i18n={
    ru:{eyebrow:'Вживую · с Катей Алюровой',events:'Скоро на сцене',button:'Открыть событие в Facebook ↗',
      next:'Продолжить свой музыкальный путь',journey:'У каждого свой путь к звучанию',journeyNote:'Можно начать с короткой бесплатной практики, выбрать самостоятельный формат или прийти на живую встречу. Все форматы — самостоятельные, ничего покупать по цепочке не обязательно.',current:'Вы здесь',details:'Подробнее →',
      steps:['Попробовать бесплатно','Полный гайд','14 дней с голосом','Живая импровизация'],stage:'Один голос · разные форматы'},
    en:{eyebrow:'Live · with Katya Alyurova',events:'On stage soon',button:'View the Facebook event ↗',
      next:'Your next musical step',journey:'Find your own path into music',journeyNote:'Start with free exercises, choose a self-paced program, or come to a live meeting. Each is independent; no sequential purchase is required.',current:'You are here',details:'Explore →',
      steps:['Try for free','Complete voice guide','14-day voice course','Live improvisation'],stage:'One voice · many paths'},
    he:{eyebrow:'לייב · עם קטיה אליורובה',events:'בקרוב על הבמה',button:'פתיחת אירוע בפייסבוק ↗',
      next:'הצעד המוזיקלי הבא שלך',journey:'לכל אחד ואחת מסלול מוזיקלי אישי',journeyNote:'אפשר להתחיל בחינם, לתרגל באופן עצמאי או להגיע למפגש חי. כל אחד מהמסלולים עומד בפני עצמו.',current:'כאן אתם',details:'לפרטים ←',
      steps:['תרגול חינמי','מדריך קולי מלא','קורס קול ל-14 יום','אלתור בקבוצה'],stage:'קול אחד · דרכים רבות'}
  };
  const routes=[
    {id:'free',href:'/3-praktiki-golosa.html'},
    {id:'guide',href:'/guide-how-to-stop-being-shy-of-your-voice.html'},
    {id:'course',href:'/golos-bez-straha.html'},
    {id:'group',href:'/zhivi-i-zvuchi.html'}
  ];
  const nextByPage={
    '/':'course','/index.html':'course',
    '/3-praktiki-golosa.html':'guide',
    '/guide-how-to-stop-being-shy-of-your-voice.html':'course',
    '/golos-bez-straha.html':'group',
    '/zhivi-i-zvuchi.html':'course',
    '/music-improvisation-adults.html':'group',
    '/vocal-improvisation.html':'group',
    '/vocal-haifa.html':'free',
    '/haifa.html':'group',
    '/maria-krasilova.html':'free'
  };
  const offers={
    free:{title:['4 бесплатных упражнения для голоса','4 free voice exercises','4 תרגילי קול בחינם'],copy:['Сначала попробуйте «Кошку», «Акустику», «Ня» и «Дуэт». Без регистрации.','Try four simple exercises without signing up.','נסו ארבעה תרגילי קול פשוטים, ללא הרשמה.'],detail:['Открытый фрагмент','A free starting point','נקודת התחלה חינמית']},
    guide:{title:['Гайд «Как перестать стесняться своего голоса?»','Voice confidence · practical guide','מדריך לתרגול קול בביטחון'],copy:['Самостоятельные упражнения в удобном темпе, к которым можно возвращаться.','Exercises you can revisit and practice at your own pace.','תרגילים שאפשר לחזור אליהם בקצב שלכם.'],detail:['50 ₪ / 12 € · цифровой материал','50 ₪ / €12 · digital guide','50 ₪ / €12 · מדריך דיגיטלי']},
    course:{title:['«Голос без страха» · 14 дней','Voice Without Fear · 14 days','קול ללא פחד · 14 ימים'],copy:['Семь блоков голосовых заданий, авторские треки, доступ на 2 месяца. Можно заниматься самостоятельно или с личной обратной связью.','Seven guided practices, original music and two months of access. Self-paced or with personal feedback.','שבעה תרגולים, מוזיקה מקורית וגישה לחודשיים. לבד או עם משוב אישי.'],detail:['220 ₪ самостоятельно · 499 ₪ с обратной связью','220 ₪ self-guided · 499 ₪ with feedback','220 ₪ לבד · 499 ₪ עם משוב']},
    group:{title:['«Живи и звучи» · Хайфа','Live & Sound · Haifa','לחיות ולהשמיע · חיפה'],copy:['Живая практика голосовой импровизации с другими людьми. Слушаем, пробуем, создаём музыку в моменте.','Live voice improvisation with other people. Listen, respond and make music together.','אלתור קולי עם אנשים נוספים: מקשיבים, מגיבים ויוצרים יחד.'],detail:['Живая встреча · музыкальный опыт не нужен','In person · no music background needed','מפגש חי · אין צורך בניסיון מוזיקלי']}
  };
  function language(){const l=(document.documentElement.lang||'ru').slice(0,2);return i18n[l]?l:'ru'}
  function tr(array,lang){return array[{ru:0,en:1,he:2}[lang]]}
  function isAvailable(event){
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Jerusalem',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
    const date=[parts.year,parts.month,parts.day].join('-');
    return date<=event.date;
  }
  function element(tag,cls,text){
    const e=document.createElement(tag);
    if(cls)e.className=cls;
    if(text!==undefined)e.textContent=text;
    return e;
  }
  function anchor(href,cls,text,external=false){
    const a=element('a',cls,text);a.href=href;
    if(external){a.target='_blank';a.rel='noopener noreferrer'}
    return a;
  }
  function eventCard(event,l,c){
    const card=element('article','mk-event-card mk-event-'+event.id);
    const top=element('div','mk-event-date',tr(event.kicker,l));
    const title=element('h3','mk-event-title',tr(event.title,l));
    const description=element('p','mk-event-description',tr(event.description,l));
    const cta=anchor(event.url,'mk-event-cta',c.button,true);
    cta.dataset.offerId=event.id;cta.dataset.funnelStep='event_'+event.id;
    card.append(top,title,description,cta);
    return card;
  }
  function nextCard(id,l,c){
    const o=offers[id],card=element('article','mk-next-card');
    card.append(element('p','mk-next-eyebrow',c.next));
    card.append(element('h3','mk-next-title',tr(o.title,l)));
    card.append(element('p','mk-next-body',tr(o.copy,l)));
    card.append(element('p','mk-next-detail',tr(o.detail,l)));
    const href=routes.find(x=>x.id===id).href;
    const a=anchor(href,'mk-next-link',c.details);a.dataset.funnelStep='offer_'+id;
    card.append(a);
    return card;
  }
  function createRail(l,c){
    const section=element('aside','mk-offer-rail '+(p==='/'||p==='/index.html'?'mk-offer-home':''));section.setAttribute('aria-label',c.events);
    const current=events.filter(isAvailable);
    if(current.length){
      const heading=element('div','mk-offer-heading');
      heading.append(element('span','mk-offer-eyebrow',c.eyebrow),element('h2','mk-offer-label',c.events));
      section.append(heading);
      const eventList=element('div','mk-offer-list');
      current.forEach(ev=>eventList.append(eventCard(ev,l,c)));
      section.append(eventList);
    }
    section.append(nextCard(nextByPage[p]||'free',l,c));
    return section;
  }
  function createJourney(l,c){
    const section=element('section','mk-journey');
    section.setAttribute('aria-label',c.journey);
    section.append(element('p','mk-journey-eyebrow',c.stage),element('h2','mk-journey-title',c.journey),element('p','mk-journey-intro',c.journeyNote));
    const list=element('nav','mk-journey-links');
    list.setAttribute('aria-label',c.journey);
    routes.forEach((route,i)=>{
      const current=route.href===p;
      const a=anchor(route.href,'mk-journey-step'+(current?' mk-journey-current':''),'');
      a.append(element('span','mk-journey-number',String(i+1)),element('span','mk-journey-step-name',c.steps[i]));
      if(current){a.setAttribute('aria-current','page');a.append(element('small','mk-journey-you',c.current))}
      a.dataset.funnelStep='journey_'+route.id;
      list.append(a);
    });
    section.append(list);return section;
  }
  const main=document.querySelector('main');if(!main)return;
  const railHolder=element('div','mk-offer-host'),journeyHolder=element('div','mk-journey-host');
  const placement=(p==='/'||p==='/index.html')?main.querySelector('#people'):main.querySelector('.hero');
  if(placement)placement.after(railHolder);else main.append(railHolder);
  main.append(journeyHolder);
  function render(){
    const l=language(),c=i18n[l];
    railHolder.replaceChildren(createRail(l,c));journeyHolder.replaceChildren(createJourney(l,c));
  }
  render();
  window.addEventListener('maria:languagechange',render);
  document.addEventListener('click',function(e){
    const a=e.target.closest('.mk-offer-rail [data-funnel-step],.mk-journey [data-funnel-step]');
    if(!a)return;
    if(typeof window.gtag==='function')window.gtag('event','select_promotion',{promotion_name:a.dataset.funnelStep,item_id:a.dataset.offerId||a.dataset.funnelStep});
  });
})();
