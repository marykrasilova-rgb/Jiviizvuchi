import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const db=createClient('https://uecdlqlwsrqmocbpgiwj.supabase.co','sb_publishable_QJ_4e8-BHl0gOZifGqdv1w_doFwpTlb',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const D={ru:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],he:["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","שבת"]};
const TASKS=[
{ru:"Гаммы",he:"סולמות",rows:[
["scale_r","Гамма — правой рукой","סולם — יד ימין"],["scale_l","Гамма — левой рукой","סולם — יד שמאל"],["scale_b","Гамма — двумя руками в одну сторону","סולם — שתי ידיים באותו כיוון"],["scale_c","Гамма — расходящееся движение","סולם בתנועה מנוגדת"]]},
{ru:"Хроматическая гамма",he:"סולם כרומטי",rows:[
["chrom_r","Хроматическая гамма — правой рукой","סולם כרומטי — יד ימין"],["chrom_l","Хроматическая гамма — левой рукой","סולם כרומטי — יד שמאל"],["chrom_b","Хроматическая гамма — двумя руками","סולם כרומטי — שתי ידיים"]]},
{ru:"Аккорды",he:"אקורדים",rows:[
["chord_r","Аккорды — правой рукой","אקורדים — יד ימין"],["chord_l","Аккорды — левой рукой","אקורדים — יד שמאל"],["chord_b","Аккорды — двумя руками","אקורדים — שתי ידיים"]]},
{ru:"Арпеджио",he:"ארפג'ו קצר",rows:[
["arp_r","Арпеджио — правой рукой","ארפג'ו — יד ימין"],["arp_l","Арпеджио — левой рукой","ארפג'ו — יד שמאל"],["arp_b","Арпеджио — двумя руками","ארפג'ו — שתי ידיים"]]},
{ru:"Длинное арпеджио",he:"ארפג'ו ארוך",rows:[
["long_r","Длинное арпеджио — правой рукой","ארפג'ו ארוך — יד ימין"],["long_l","Длинное арпеджио — левой рукой","ארפג'ו ארוך — יד שמאל"],["long_b","Длинное арпеджио — двумя руками","ארפג'ו ארוך — שתי ידיים"]]},
{ru:"Другие задания",he:"משימות נוספות",rows:[
["reading","Чтение с листа","קריאה מהדף"],["pitch","Звуковысотные движения","תנועות בגובה הצליל"],["quiz","Музыкальная викторина","חידון מוזיקלי"]]}
];
const CRIT=[
["right","Ноты правой рукой","תווים ביד ימין"],["left","Ноты левой рукой","תווים ביד שמאל"],["finger","Аппликатура","אצבוע"],["together","Две руки вместе","שתי ידיים ביחד"],["smooth","Без остановок","ללא עצירות"],["tempo","Ровный темп","קצב אחיד"],["dynamics","Динамика","דינמיקה"],["record","Записал(а) себя","הקלטה והאזנה"]
];
const COPY={
ru:{eyebrow:"Музыка каждый день",mainTitle:"Один дневник — два взгляда на прогресс",mainLead:"Преподаватель даёт задания и видит результат. Ученик отмечает занятия, собирает звёзды и открывает достижения.",roleTeacher:"Я преподаватель",roleTeacherHint:"Мой класс, ученики, задания и отчёты",roleStudent:"Я ученик / родитель",roleStudentHint:"Мой дневник, практика и достижения",changeRoleLabel:"Назад",emailLabel:"Электронная почта",passLabel:"Пароль (от 8 символов)",nameLabel:"Как вас зовут?",consentText:"Я принимаю Политику конфиденциальности и Условия использования сайта.",authNote:"Для несовершеннолетнего ученика аккаунт создаёт родитель или законный представитель. Используйте псевдоним вместо полного имени ребёнка.",introFoot:"Пилотная версия. Данные учителей и учеников хранятся раздельно. Пока можно присоединиться только к одному преподавателю.",formLogin:"Войти",formSignup:"Регистрация",toggleSignup:"Создать аккаунт",toggleLogin:"Уже есть аккаунт? Войти",roleTeacherShort:"Для преподавателя",roleStudentShort:"Для ученика",signupCheck:"Подтверди согласие с условиями.",nameRequired:"Введите имя преподавателя.",passwordShort:"Пароль должен содержать хотя бы 8 символов.",signupOk:"Проверьте почту и подтвердите адрес. Затем войдите.",loading:"Подождите…",welcomeEyebrow:"Профиль",welcomeTitle:"С чего начнём?",welcomeText:"Создайте преподавательский журнал или подключитесь к своему преподавателю.",newTeacherText:"Создать журнал преподавателя",newStudentText:"Подключиться как ученик",setupTitle:"Мой музыкальный класс",teacherNameLabel:"Имя преподавателя или студии",createTeacher:"Создать класс",joinTitle:"Подключиться к преподавателю",joinHelp:"Попросите у преподавателя личную ссылку или 16-значный код приглашения.",inviteLabel:"Код приглашения",joinClass:"Подключиться",teacherLabel:"Кабинет преподавателя",teacherTitle:"Мой музыкальный класс",teacherSub:"Добавляйте учеников, выдавайте задания и наблюдайте за домашней практикой.",teacherChip:"Преподаватель",tStudentsLabel:"Учеников",tJoinedLabel:"Подключились",tReportsLabel:"Отчётов за неделю",addTitle:"Добавить ученика",addName:"Имя или псевдоним ученика",addHomework:"Первое домашнее задание",addStudent:"Добавить",addHint:"Ученик подключится по персональному коду. Для детей рекомендуем псевдоним и аккаунт родителя.",classTitle:"Мои ученики",studentRecordLabel:"Журнал ученика",homeworkLabel:"Домашнее задание",saveHomework:"Сохранить задание",copyInvite:"Скопировать приглашение",weekReportTitle:"Прогресс за неделю",teacherWeekLabel:"Неделя с",historyTitle:"Последние недели",notConnected:"Пока не подключился",connected:"Подключён",inviteStatus:"Код для ученика: ",noStudents:"Добавьте первого ученика.",noReport:"За эту неделю отметок пока нет.",nameBlank:"Укажите имя ученика.",invitationCopied:"Ссылка приглашения скопирована.",copyUnavailable:"Не удалось скопировать ссылку. Код можно переписать вручную.",saved:"Сохранено",error:"Не получилось: ",days:"Дней с практикой",stars:"Звёзд",tasks:"Упражнений",pieces:"Пьесы",studentLabel:"Личный дневник",studentTitle:"Мой музыкальный путь",studentChip:"Ученик",homeworkHeading:"Задание от преподавателя",noHomework:"Преподаватель пока не назначил домашнее задание.",practiceTitle:"Моя неделя",weekSelectorLabel:"Неделя с",starsLabel:"Звёзды",daysLabel:"Дней занятий",levelLabel:"Уровень",scaleLabel:"Гамма недели",pieceTitle:"Работа над пьесами",reflectionLabel:"Что получилось лучше всего?",saveWeek:"Сохранить неделю",achievementsTitle:"Мои достижения",quizLink:"Угадай композитора →",classicJournal:"Обычный дневник",privacyLink:"Конфиденциальность",termsLink:"Условия",betaNote:"Пилот: ученические отчёты доступны только учителю и соответствующему аккаунту ученика. Оплаты и публичного рейтинга нет.",studentSub:"Мой журнал и задания · преподаватель: ",dayCompleted:"Сегодня позанимался(лась)",reportScale:"Гамма недели",reportReflection:"Итог недели",reportPieces:"Работа над пьесами",noPieces:"Пока не выбраны",noNotes:"Нет записей",badges:[["🌱","Первый шаг","1 день практики"],["🎵","Ритм","3 дня занятий"],["🌟","Звезда недели","5 дней занятий"],["🦋","Бабочка","Расходящаяся гамма"],["🎹","Исследователь","4 раздела техники"],["🎼","Артист","4 навыка одной пьесы"]],piece:"Пьеса ",noHistory:"История появится после первой сохранённой недели.",yourClass:"Ваш класс",teacherInitFail:"Ошибка создания класса",invalidCode:"Проверьте код приглашения.",alreadyLinked:"Этот аккаунт уже подключён к преподавателю."},
he:{eyebrow:"מוזיקה בכל יום",mainTitle:"יומן אחד — שתי נקודות מבט על ההתקדמות",mainLead:"המורה נותן משימות ורואה התקדמות. התלמיד מסמן תרגול, צובר כוכבים ומשיג הישגים.",roleTeacher:"אני מורה",roleTeacherHint:"הכיתה, התלמידים, המשימות והדוחות",roleStudent:"אני תלמיד/ה או הורה",roleStudentHint:"היומן שלי, התרגול וההישגים",changeRoleLabel:"חזרה",emailLabel:"כתובת אימייל",passLabel:"סיסמה (לפחות 8 תווים)",nameLabel:"איך קוראים לך?",consentText:"אני מסכים/ה למדיניות הפרטיות ולתנאי השימוש.",authNote:"חשבון של ילד/ה נפתח על ידי הורה או אפוטרופוס. מומלץ להשתמש בכינוי במקום בשם מלא.",introFoot:"גרסת הרצה. המידע של כל מורה ותלמיד נשמר בנפרד. כרגע אפשר להצטרף למורה אחד בלבד.",formLogin:"כניסה",formSignup:"הרשמה",toggleSignup:"יצירת חשבון",toggleLogin:"יש לך חשבון? כניסה",roleTeacherShort:"למורים",roleStudentShort:"לתלמידים",signupCheck:"יש לאשר את התנאים.",nameRequired:"יש להזין שם מורה.",passwordShort:"יש להשתמש בסיסמה עם לפחות 8 תווים.",signupOk:"יש לבדוק את הדוא״ל ולאשר את הכתובת, ואז להיכנס.",loading:"נא להמתין…",welcomeEyebrow:"פרופיל",welcomeTitle:"איך מתחילים?",welcomeText:"פותחים יומן למורה או מצטרפים למורה קיים.",newTeacherText:"יצירת יומן מורה",newStudentText:"הצטרפות כתלמיד/ה",setupTitle:"הכיתה המוזיקלית שלי",teacherNameLabel:"שם המורה או הסטודיו",createTeacher:"יצירת כיתה",joinTitle:"הצטרפות למורה",joinHelp:"יש לבקש מהמורה קישור אישי או קוד הזמנה בן 16 תווים.",inviteLabel:"קוד הזמנה",joinClass:"הצטרפות",teacherLabel:"אזור המורה",teacherTitle:"הכיתה המוזיקלית שלי",teacherSub:"מוסיפים תלמידים, נותנים משימות ועוקבים אחר התרגול בבית.",teacherChip:"מורה",tStudentsLabel:"תלמידים",tJoinedLabel:"התחברו",tReportsLabel:"דוחות השבוע",addTitle:"הוספת תלמיד/ה",addName:"שם או כינוי תלמיד/ה",addHomework:"משימת בית ראשונה",addStudent:"הוספה",addHint:"התלמיד/ה מתחבר/ת בקוד אישי. לילדים מומלץ להשתמש בכינוי ובחשבון הורה.",classTitle:"התלמידים שלי",studentRecordLabel:"יומן התלמיד/ה",homeworkLabel:"שיעורי בית",saveHomework:"שמירת המשימה",copyInvite:"העתקת הזמנה",weekReportTitle:"התקדמות השבוע",teacherWeekLabel:"שבוע מ",historyTitle:"שבועות אחרונים",notConnected:"עדיין לא התחבר/ה",connected:"מחובר/ת",inviteStatus:"קוד לתלמיד/ה: ",noStudents:"אפשר להוסיף את התלמיד/ה הראשון/ה.",noReport:"אין עדיין סימונים לשבוע זה.",nameBlank:"יש להזין שם תלמיד/ה.",invitationCopied:"הקישור הועתק.",copyUnavailable:"לא ניתן להעתיק. אפשר למסור את הקוד ידנית.",saved:"נשמר",error:"שגיאה: ",days:"ימי תרגול",stars:"כוכבים",tasks:"תרגילים",pieces:"יצירות",studentLabel:"יומן אישי",studentTitle:"המסע המוזיקלי שלי",studentChip:"תלמיד/ה",homeworkHeading:"משימה מהמורה",noHomework:"המורה עדיין לא נתן/ה משימה.",practiceTitle:"השבוע שלי",weekSelectorLabel:"שבוע מ",starsLabel:"כוכבים",daysLabel:"ימי תרגול",levelLabel:"רמה",scaleLabel:"סולם השבוע",pieceTitle:"עבודה על יצירות",reflectionLabel:"מה השתפר השבוע?",saveWeek:"שמירת השבוע",achievementsTitle:"ההישגים שלי",quizLink:"נחשו את המלחין ←",classicJournal:"היומן הרגיל",privacyLink:"פרטיות",termsLink:"תנאים",betaNote:"גרסת הרצה: הדוחות גלויים רק למורה ולחשבון התלמיד/ה הרלוונטי. אין תשלום או דירוג פומבי.",studentSub:"היומן והמשימות שלי · המורה: ",dayCompleted:"תרגול היום",reportScale:"סולם השבוע",reportReflection:"סיכום השבוע",reportPieces:"עבודה על יצירות",noPieces:"עדיין לא נבחרו",noNotes:"ללא הערות",badges:[["🌱","צעד ראשון","יום תרגול אחד"],["🎵","קצב","3 ימי תרגול"],["🌟","כוכב השבוע","5 ימי תרגול"],["🦋","פרפר","סולם בתנועה מנוגדת"],["🎹","חוקר/ת","4 תחומי טכניקה"],["🎼","נגן/ית","4 מיומנויות ביצירה"]],piece:"יצירה ",noHistory:"היסטוריה תופיע לאחר שמירת השבוע הראשון.",yourClass:"הכיתה שלך",teacherInitFail:"שגיאה ביצירת כיתה",invalidCode:"יש לבדוק את קוד ההזמנה.",alreadyLinked:"החשבון הזה כבר מחובר למורה."}
};
let lang=new URLSearchParams(location.search).get('lang')==='he'?'he':(localStorage.getItem('piano-school-lang')||'ru');
if(!COPY[lang])lang='ru';
let user=null,roleChoice='teacher',isSignup=false,teacher=null,student=null,teacherName='',teacherRows=[],selectedId=null,weekReport=null,reportWeek=weekSunday(new Date()),weekRecords=[],pendingSave=null;
const langText=()=>COPY[lang];
const weekDate=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
function weekSunday(d){const a=new Date(d);a.setDate(a.getDate()-a.getDay());return weekDate(a)}
function selectedSunday(value){const date=new Date((value||weekDate(new Date()))+"T12:00:00");return Number.isNaN(+date)?weekSunday(new Date()):weekSunday(date)}
function show(id){["authScreen","chooseRoleScreen","teacherScreen","studentScreen"].forEach(k=>$(k).classList.toggle('hidden',k!==id))}
function notify(text,bad=false){const n=$('notification');n.textContent=text;n.classList.remove('hidden');n.classList.toggle('error',bad);window.scrollTo({top:0,behavior:'smooth'})}
function quiet(){const n=$('notification');n.classList.add('hidden');n.textContent=''}
function set(id,key){$(id).textContent=langText()[key]}
function renderLanguage(){
 document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';
 $('ru').classList.toggle('on',lang==='ru');$('he').classList.toggle('on',lang==='he');
 const fields=['eyebrow','mainTitle','mainLead','roleTeacher','roleTeacherHint','roleStudent','roleStudentHint','changeRoleLabel','emailLabel','passLabel','nameLabel','consentText','authNote','introFoot','welcomeEyebrow','welcomeTitle','welcomeText','newTeacherText','newStudentText','setupTitle','teacherNameLabel','createTeacher','joinTitle','joinHelp','inviteLabel','joinClass','teacherLabel','teacherTitle','teacherSub','teacherChip','tStudentsLabel','tJoinedLabel','tReportsLabel','addTitle','addName','addHomework','addHint','classTitle','studentRecordLabel','homeworkLabel','saveHomework','copyInvite','weekReportTitle','teacherWeekLabel','historyTitle','studentLabel','studentTitle','studentChip','homeworkHeading','practiceTitle','weekSelectorLabel','starsLabel','daysLabel','levelLabel','scaleLabel','pieceTitle','reflectionLabel','saveWeek','achievementsTitle','quizLink','classicJournal','privacyLink','termsLink','betaNote'];
 for(const id of fields)set(id,id);
 set('addStudent','addStudent');set('logout','logout');
 $('logout').textContent=lang==='he'?'יציאה':'Выйти';
 $('quizLink').href='/games?lang='+lang+'#quiz';
 renderAuthForm();
 if(teacher)renderTeacher();
 if(student)renderStudent();
}
function renderAuthForm(){
 $('formRole').textContent=langText()[roleChoice==='teacher'?'roleTeacherShort':'roleStudentShort'];
 $('formTitle').textContent=langText()[isSignup?'formSignup':'formLogin'];
 $('submitAuth').textContent=langText()[isSignup?'formSignup':'formLogin'];
 $('toggleAuth').textContent=langText()[isSignup?'toggleLogin':'toggleSignup'];
 $('nameField').classList.toggle('hidden',!(isSignup&&roleChoice==='teacher'));
 $('consentBox').classList.toggle('hidden',!isSignup);
 $('password').autocomplete=isSignup?'new-password':'current-password';
}
$('ru').onclick=()=>{lang='ru';localStorage.setItem('piano-school-lang',lang);renderLanguage()};
$('he').onclick=()=>{lang='he';localStorage.setItem('piano-school-lang',lang);renderLanguage()};
function selectRole(which){quiet();roleChoice=which;isSignup=false;renderAuthForm();$('loginCard').classList.remove('hidden');$('loginCard').scrollIntoView({behavior:'smooth',block:'start'})}
$('pickTeacher').onclick=()=>selectRole('teacher');
$('pickStudent').onclick=()=>selectRole('student');
$('changeRole').onclick=()=>{$('loginCard').classList.add('hidden');quiet()};
$('toggleAuth').onclick=()=>{isSignup=!isSignup;renderAuthForm();$('authResult').textContent=''};
$('logout').onclick=async()=>{if(pendingSave)clearTimeout(pendingSave);await db.auth.signOut();location.replace('/piano-school.html?lang='+lang)};
$('submitAuth').onclick=async()=>{
 const email=$('email').value.trim(),password=$('password').value,name=$('displayName').value.trim();
 if(!email||password.length<8){$('authResult').textContent=langText().passwordShort;return}
 if(isSignup&&!$('consent').checked){$('authResult').textContent=langText().signupCheck;return}
 if(isSignup&&roleChoice==='teacher'&&!name){$('authResult').textContent=langText().nameRequired;return}
 $('submitAuth').disabled=true;$('authResult').textContent=langText().loading;
 try {
  if(isSignup){
   localStorage.setItem('piano-school-pending-role',roleChoice);
   if(name)localStorage.setItem('piano-school-pending-teacher-name',name);
   const {data,error}=await db.auth.signUp({email,password,options:{emailRedirectTo:'https://krasilova.com/piano-school.html',data:{terms_accepted:true,privacy_accepted:true,piano_school_role_intent:roleChoice}}});
   if(error)throw error;
   $('authResult').textContent=langText().signupOk;
   if(data.session)await loadIdentity();
  }else{
   const {error}=await db.auth.signInWithPassword({email,password});
   if(error)throw error;
   await loadIdentity();
  }
 }catch(e){$('authResult').textContent=langText().error+(e.message||e)}
 finally{$('submitAuth').disabled=false}
};
$('newTeacher').onclick=()=>{$('teacherSetup').classList.remove('hidden');$('studentSetup').classList.add('hidden');$('teacherName').value=localStorage.getItem('piano-school-pending-teacher-name')||''};
$('newStudent').onclick=()=>{$('studentSetup').classList.remove('hidden');$('teacherSetup').classList.add('hidden')};
$('createTeacher').onclick=async()=>{
 const name=$('teacherName').value.trim();if(!name){notify(langText().nameRequired,true);return}
 $('createTeacher').disabled=true;
 const {error}=await db.from('piano_teacher_accounts').insert({user_id:user.id,display_name:name});
 $('createTeacher').disabled=false;
 if(error){notify(langText().teacherInitFail+': '+error.message,true);return}
 localStorage.removeItem('piano-school-pending-role');
 localStorage.removeItem('piano-school-pending-teacher-name');
 await loadIdentity();
};
$('joinClass').onclick=async()=>{
 const code=$('inviteCode').value.trim().replace(/\s/g,'').toUpperCase();
 if(!/^[A-F0-9]{16}$/.test(code)){notify(langText().invalidCode,true);return}
 $('joinClass').disabled=true;
 const {error}=await db.rpc('piano_join_class',{p_code:code});
 $('joinClass').disabled=false;
 if(error){notify(langText().error+error.message,true);return}
 localStorage.removeItem('piano-school-pending-role');
 await loadIdentity();
};
async function loadIdentity(){
 quiet();
 const {data:{user:current},error}=await db.auth.getUser();
 if(error||!current){user=null;teacher=null;student=null;$('logout').classList.add('hidden');show('authScreen');return}
 user=current;$('logout').classList.remove('hidden');
 const [t,st]=await Promise.all([
  db.from('piano_teacher_accounts').select('user_id,display_name').eq('user_id',user.id).maybeSingle(),
  db.from('piano_class_students').select('id,teacher_user_id,display_name,homework').eq('student_user_id',user.id).maybeSingle()
 ]);
 if(t.error||st.error){notify(langText().error+(t.error?.message||st.error?.message),true);return}
 teacher=t.data;student=st.data;
 if(teacher){show('teacherScreen');await loadTeacher();return}
 if(student){show('studentScreen');await loadStudent();return}
 show('chooseRoleScreen');
 const code=new URLSearchParams(location.search).get('invite');
 if(code){$('inviteCode').value=code.toUpperCase();$('newStudent').click();return}
 const intent=localStorage.getItem('piano-school-pending-role');
 if(intent==='teacher')$('newTeacher').click();else if(intent==='student')$('newStudent').click();
}
function defaultReport(){return {checks:{},pieces:Array.from({length:2},()=>({name:'',done:{}})),scale:'',reflection:''}}
function normalizeReport(r){let o=(r&&typeof r==='object'&&!Array.isArray(r))?r:{};return {...defaultReport(),...o,checks:(o.checks&&typeof o.checks==='object')?o.checks:{},pieces:Array.from({length:2},(_,i)=>({name:String(o.pieces?.[i]?.name||''),done:o.pieces?.[i]?.done||{}}))}}
function statsOf(report){
 let r=normalizeReport(report),days=D.ru.map((_,i)=>TASKS.some(g=>g.rows.some(row=>r.checks[row[0]+':'+i]))),groups=TASKS.filter(g=>g.rows.some(row=>days.some((_,i)=>r.checks[row[0]+':'+i]))).map(g=>g.ru),pieceCount=r.pieces.reduce((n,p)=>n+CRIT.filter(c=>p.done[c[0]]).length,0);
 let taskCount=Object.values(r.checks).filter(Boolean).length,points=days.filter(Boolean).length*10+groups.length*5+pieceCount*5;
 return {days,daysCount:days.filter(Boolean).length,groups,taskCount,points,level:Math.min(5,1+Math.floor(points/50)),pieceCount}
}
async function loadTeacher(){
 const {data,error}=await db.from('piano_class_students').select('id,teacher_user_id,student_user_id,display_name,homework,invite_code,created_at').eq('teacher_user_id',user.id).order('created_at',{ascending:false});
 if(error){notify(langText().error+error.message,true);return}
 teacherRows=data||[];
 let weeklyReports=0;
 if(teacherRows.length){const ids=teacherRows.map(x=>x.id);const currentWeek=weekSunday(new Date());const {data:rows,error:reportsError}=await db.from('piano_class_weeks').select('student_id').in('student_id',ids).eq('week_start',currentWeek);if(!reportsError)weeklyReports=(rows||[]).length}
 $('tReports').textContent=String(weeklyReports);
 if(!teacherRows.some(x=>x.id===selectedId))selectedId=teacherRows[0]?.id||null;
 await renderTeacher();
}
$('refreshTeacher').onclick=loadTeacher;
$('addStudent').onclick=async()=>{
 const name=$('newStudentName').value.trim(),homework=$('newStudentHomework').value.trim();
 if(!name){notify(langText().nameBlank,true);return}
 $('addStudent').disabled=true;
 const {data,error}=await db.from('piano_class_students').insert({teacher_user_id:user.id,display_name:name,homework}).select('id').single();
 $('addStudent').disabled=false;
 if(error){notify(langText().error+error.message,true);return}
 $('newStudentName').value='';$('newStudentHomework').value='';selectedId=data.id;await loadTeacher();
};
function invitation(code){return location.origin+'/piano-school.html?invite='+encodeURIComponent(code)+'&lang='+lang}
$('saveHomework').onclick=async()=>{
 let item=teacherRows.find(s=>s.id===selectedId);if(!item)return;
 const homework=$('teacherHomework').value.trim();
 const {error}=await db.from('piano_class_students').update({homework}).eq('id',item.id);
 if(error){notify(langText().error+error.message,true);return}
 item.homework=homework;notify(langText().saved);
};
$('copyInvite').onclick=async()=>{let item=teacherRows.find(s=>s.id===selectedId);if(!item)return;try{await navigator.clipboard.writeText(invitation(item.invite_code));notify(langText().invitationCopied)}catch(e){notify(langText().copyUnavailable,true)}};
$('teacherWeek').onchange=async()=>{reportWeek=selectedSunday($('teacherWeek').value);$('teacherWeek').value=reportWeek;await loadTeacherReport()};
async function renderTeacher(){
 if(!teacher)return;
 $('tStudents').textContent=teacherRows.length;$('tJoined').textContent=teacherRows.filter(s=>!!s.student_user_id).length;
 $('teacherStudents').innerHTML=teacherRows.length?teacherRows.map(s=>'<button type="button" class="student-list-item'+(s.id===selectedId?' selected':'')+'" data-student="'+safe(s.id)+'"><span><b>'+safe(s.display_name)+'</b><small>'+safe(langText()[s.student_user_id?'connected':'notConnected'])+'</small></span><span class="chevron">›</span></button>').join(''):'<p class="small">'+langText().noStudents+'</p>';
 $('teacherStudents').querySelectorAll('[data-student]').forEach(b=>b.onclick=async()=>{selectedId=b.dataset.student;await renderTeacher()});
 $('selectedStudentCard').classList.toggle('hidden',!selectedId);
 if(!selectedId){return}
 const item=teacherRows.find(s=>s.id===selectedId);
 $('selectedStudentTitle').textContent=item.display_name;
 $('studentJoinState').textContent=langText()[item.student_user_id?'connected':'notConnected'];
 $('inviteStatus').textContent=langText().inviteStatus+item.invite_code;
 $('teacherHomework').value=item.homework||'';
 $('teacherWeek').value=reportWeek;
 await loadTeacherReport();
}
async function loadTeacherReport(){
 const item=teacherRows.find(s=>s.id===selectedId);if(!item)return;
 const {data,error}=await db.from('piano_class_weeks').select('week_start,report,updated_at').eq('student_id',item.id).order('week_start',{ascending:false}).limit(40);
 if(error){notify(langText().error+error.message,true);return}
 weekRecords=data||[];
 const current=weekRecords.find(x=>x.week_start===reportWeek),r=current?normalizeReport(current.report):null,st=statsOf(r);
 $('teacherReportStats').innerHTML=r?[
 [langText().days,st.daysCount+' / 7'],[langText().stars,st.points+' ★'],[langText().tasks,st.taskCount]
 ].map(x=>'<span class="report-pill">'+safe(x[0])+': <b>'+safe(x[1])+'</b></span>').join(''):'';
 if(!r){$('teacherReportDetails').textContent=langText().noReport}
 else{
  const lines=[];
  st.days.forEach((d,idx)=>{if(!d)return;const things=TASKS.flatMap(g=>g.rows.filter(row=>r.checks[row[0]+':'+idx]).map(row=>row[lang==='he'?2:1]));lines.push('<div class="report-day"><b>'+safe(D[lang][idx])+'</b> '+safe(things.join(' · '))+'</div>')});
  if(r.scale)lines.push('<p><strong>'+safe(langText().reportScale)+':</strong> '+safe(r.scale)+'</p>');
  const pieces=r.pieces.filter(p=>p.name||Object.values(p.done).some(Boolean));
  if(pieces.length)lines.push('<p><strong>'+safe(langText().reportPieces)+':</strong> '+pieces.map(p=>safe(p.name)+' ('+CRIT.filter(c=>p.done[c[0]]).map(c=>safe(c[lang==='he'?2:1])).join(', ')+')').join('; ')+'</p>');
  if(r.reflection)lines.push('<p><strong>'+safe(langText().reportReflection)+':</strong> '+safe(r.reflection)+'</p>');
  $('teacherReportDetails').innerHTML=lines.join('')||langText().noReport;
 }
 $('teacherHistory').innerHTML=weekRecords.length?weekRecords.slice(0,12).map(w=>'<button type="button" data-week="'+safe(w.week_start)+'">'+safe(w.week_start)+'</button>').join(''):'<p class="small">'+langText().noHistory+'</p>';
 $('teacherHistory').querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{reportWeek=b.dataset.week;$('teacherWeek').value=reportWeek;loadTeacherReport()});
}
async function loadStudent(){
 const {data:profile}=await db.from('piano_teacher_accounts').select('display_name').eq('user_id',student.teacher_user_id).maybeSingle();
 teacherName=profile?.display_name||'—';
 $('studentWeek').value=reportWeek;
 await loadStudentWeek();
}
async function loadStudentWeek(){
 const {data,error}=await db.from('piano_class_weeks').select('report').eq('student_id',student.id).eq('week_start',reportWeek).maybeSingle();
 if(error){notify(langText().error+error.message,true);return}
 weekReport=normalizeReport(data?.report);renderStudent();
}
function renderStudent(){
 if(!student)return;
 const t=langText();
 $('studentSub').textContent=t.studentSub+teacherName;
 $('homeworkContent').textContent=student.homework||t.noHomework;
 $('studentWeek').value=reportWeek;
 const r=weekReport||defaultReport(),stat=statsOf(r);
 $('starsCount').textContent=stat.points+' ★';$('daysCount').textContent=stat.daysCount+' / 7';$('levelCount').textContent=String(stat.level);
 $('dayGrid').innerHTML=stat.days.map((v,i)=>'<div class="day'+(v?' done':'')+'"><strong>'+safe(D[lang][i])+'</strong><span class="symbol">'+(v?'★':'○')+'</span></div>').join('');
 $('weekScale').value=r.scale||'';$('weekReflection').value=r.reflection||'';
 let h='<table><thead><tr><th>'+safe(lang==='he'?'תרגיל':'Упражнение')+'</th>'+D[lang].map(x=>'<th>'+safe(x)+'</th>').join('')+'</tr></thead><tbody>';
 for(let g of TASKS){h+='<tr class="group-row"><td colspan="8">'+safe(g[lang])+'</td></tr>';for(let row of g.rows){h+='<tr><td>'+safe(row[lang==='he'?2:1])+'</td>'+D[lang].map((d,i)=>'<td><input type="checkbox" data-task="'+row[0]+':'+i+'" aria-label="'+safe(row[lang==='he'?2:1]+' '+d)+'"'+(r.checks[row[0]+':'+i]?' checked':'')+'></td>').join('')+'</tr>'}}
 $('studentChecklist').innerHTML=h+'</tbody></table>';
 $('pieceGrid').innerHTML=r.pieces.map((p,i)=>'<div class="piece-box"><label class="small">'+safe(t.piece+(i+1))+'<input type="text" maxlength="150" data-piece-name="'+i+'" value="'+safe(p.name)+'"></label>'+CRIT.map(c=>'<label class="piece-check"><input type="checkbox" data-piece="'+i+':'+c[0]+'"'+(p.done[c[0]]?' checked':'')+'><span>'+safe(c[lang==='he'?2:1])+'</span></label>').join('')+'</div>').join('');
 const badges=t.badges,techGroups=TASKS.slice(0,5).filter(g=>g.rows.some(row=>stat.days.some((_,idx)=>r.checks[row[0]+':'+idx]))).length;
 const flags=[stat.daysCount>=1,stat.daysCount>=3,stat.daysCount>=5,stat.days.some((_,i)=>r.checks['scale_c:'+i]),techGroups>=4,r.pieces.some(p=>CRIT.filter(c=>p.done[c[0]]).length>=4)];
 $('achievements').innerHTML=badges.map((b,i)=>'<div class="achievement'+(flags[i]?' earned':'')+'"><span class="symbol">'+b[0]+'</span><span><strong>'+safe(b[1])+'</strong><small>'+safe(b[2])+'</small></span></div>').join('');
}
$('studentWeek').onchange=async()=>{if(pendingSave){clearTimeout(pendingSave);pendingSave=null;await saveReport()}reportWeek=selectedSunday($('studentWeek').value);$('studentWeek').value=reportWeek;await loadStudentWeek()};
function markDirty(){
 if(pendingSave)clearTimeout(pendingSave);
 $('weekSaveStatus').textContent=lang==='he'?'יש שינויים שלא נשמרו':'Есть несохранённые изменения';
 pendingSave=setTimeout(()=>{pendingSave=null;saveReport()},700);
}
function onStudentInput(e){
 if(!weekReport)return;
 const el=e.target;
 if(el.dataset.task){weekReport.checks[el.dataset.task]=el.checked;renderStudent();markDirty();return}
 if(el.dataset.piece){const [idx,k]=el.dataset.piece.split(':');weekReport.pieces[+idx].done[k]=el.checked;renderStudent();markDirty();return}
 if(el.dataset.pieceName!==undefined)weekReport.pieces[+el.dataset.pieceName].name=el.value;
 if(el.id==='weekScale')weekReport.scale=el.value;
 if(el.id==='weekReflection')weekReport.reflection=el.value;
 markDirty();
}
$('studentChecklist').addEventListener('change',onStudentInput);
$('pieceGrid').addEventListener('change',onStudentInput);
$('pieceGrid').addEventListener('input',e=>{if(e.target.dataset.pieceName!==undefined)onStudentInput(e)});
$('weekScale').addEventListener('input',onStudentInput);
$('weekReflection').addEventListener('input',onStudentInput);
async function saveReport(){
 if(!student||!weekReport)return;
 const date=reportWeek,contents=JSON.parse(JSON.stringify(weekReport));
 $('weekSaveStatus').textContent=lang==='he'?'שומר…':'Сохраняю…';
 const {error}=await db.from('piano_class_weeks').upsert({student_id:student.id,week_start:date,report:contents},{onConflict:'student_id,week_start'});
 if(error){$('weekSaveStatus').textContent=langText().error+error.message;return}
 $('weekSaveStatus').textContent=langText().saved;
}
$('saveWeek').onclick=async()=>{if(pendingSave)clearTimeout(pendingSave);pendingSave=null;await saveReport()};
async function initialize(){
 const code=new URLSearchParams(location.search).get('invite');if(code){$('inviteCode').value=code.toUpperCase();roleChoice='student'}
 renderLanguage();await loadIdentity();
 if(!user&&code)selectRole('student');
}
initialize();
