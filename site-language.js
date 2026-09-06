(function () {
  'use strict';

  const STORAGE_KEY = 'mariaSiteLang';
  const LEGACY_GAME_KEY = 'musicGameLang';
  const SUPPORTED = new Set(['ru', 'en', 'he']);
  const sourceLanguage = (document.documentElement.lang || 'ru').split('-')[0].toLowerCase();
  const dictionaries = window.MARIA_SITE_TRANSLATIONS || {};
  const editorialOverrides = {
    en: {
      'Прозвучать': 'Use your voice',
      'Я принимаю': 'I accept',
      'Что я замечаю?': 'What do I notice?',
      'После практики мне:': 'After the practice, I feel:',
      'Нарисовать состояние': 'Draw the feeling',
      'Основной цикл прост:': 'The basic cycle is simple:',
      'Интенсивность состояния': 'Intensity of the feeling',
      'Как хочется это выразить?': 'How would I like to express it?',
      'Своими словами — если хочется': 'In your own words — if you wish',
      'Что сейчас хочет выйти наружу?': 'What wants to come out right now?',
      'Заметить. Выразить. Снова заметить.': 'Notice. Express. Notice again.',
      'заметить состояние → дать ему форму → снова заметить себя': 'notice the feeling → give it form → notice yourself again',
      'Ваши записи не видны другим пользователям и не публикуются.': 'Your entries are not visible to other users and are not published.',
      'Камера нужна только для вашей личной записи. Видео не публикуется.': 'The camera is used only for your private recording. The video is not published.',
      'Выбери цвет, который сейчас хочется. Его можно менять прямо во время рисунка.': 'Choose the colour that feels right now. You can change it while drawing.',
      'Не обязательно всё объяснять словами. Можно прозвучать, подвигаться, нарисовать или написать.': 'You do not have to explain everything in words. You can use your voice, move, draw, or write.',
      'Можно выбрать несколько слов или написать своё.': 'Choose several words or add your own.',
      'Можно одной фразой. Можно оставить пустым.': 'One sentence is enough. You can also leave it blank.',
      'Можно иногда присылать новости и новые практики.': 'You may occasionally send me news and new practices.',
      'Можно использовать обезличенные данные об использовании сервиса для улучшения продукта. Содержимое записей не входит.': 'Anonymised usage data may be used to improve the product. Entry contents are excluded.',
      'Личное пространство для саморефлексии: заметить состояние, выразить его голосом, движением, рисунком или текстом и снова заметить себя.': 'A private space for self-reflection: notice a feeling, express it through voice, movement, drawing, or text, then notice yourself again.',
      'Эмоциональный дневник — Мария Красилова': 'Emotional Journal — Maria Krasilova',
      'Практик за 30 дней': 'Practices in the last 30 days',
      'Стало легче': 'Felt lighter',
      'Чаще выбираю': 'Most often I choose',
      'Всего записей': 'Total entries',
      'Здесь появятся ваши первые записи.': 'Your first entries will appear here.',
      'Заметила/заметил:': 'Noticed:',
      'интерес': 'curious',
      'напряжение': 'tension',
      'тревожно': 'anxious',
      'злюсь': 'angry',
      'устала/устал': 'tired',
      'Не удалось включить микрофон. Проверьте разрешение браузера.': 'Could not access the microphone. Check your browser permission.',
      'Не удалось включить камеру/микрофон. Проверьте разрешения браузера.': 'Could not access the camera or microphone. Check your browser permissions.',
      'Ты заметила своё состояние и дала ему место. Этого достаточно.': 'You noticed what you were feeling and gave it space. That is enough.',
      'Сначала выберите способ выражения': 'First choose a form of expression',
      'Отметьте, как вам после практики': 'Mark how you feel after the practice',
      'Напишите хотя бы несколько слов': 'Write at least a few words',
      'Сначала запишите голос': 'Record your voice first',
      'Сначала запишите движение': 'Record your movement first'
    },
    he: {
      'Прозвучать': 'להשמיע קול',
      'Я принимаю': 'אני מאשר/ת',
      'Что я замечаю?': 'במה אני מבחינ/ה?',
      'После практики мне:': 'אחרי התרגול אני מרגיש/ה:',
      'Нарисовать состояние': 'לצייר את התחושה',
      'Основной цикл прост:': 'המחזור הבסיסי פשוט:',
      'Интенсивность состояния': 'עוצמת התחושה',
      'Как хочется это выразить?': 'איך הייתי רוצה לבטא את זה?',
      'Своими словами — если хочется': 'במילים שלכם — אם תרצו',
      'Что сейчас хочет выйти наружу?': 'מה מבקש לצאת החוצה עכשיו?',
      'Заметить. Выразить. Снова заметить.': 'לשים לב. לבטא. לשים לב מחדש.',
      'заметить состояние → дать ему форму → снова заметить себя': 'לשים לב למצב → לתת לו צורה → לשים לב לעצמי מחדש',
      'Ваши записи не видны другим пользователям и не публикуются.': 'הרשומות שלכם אינן גלויות למשתמשים אחרים ואינן מתפרסמות.',
      'Камера нужна только для вашей личной записи. Видео не публикуется.': 'המצלמה משמשת רק להקלטה האישית שלכם. הסרטון אינו מתפרסם.',
      'Выбери цвет, который сейчас хочется. Его можно менять прямо во время рисунка.': 'בחרו את הצבע שמתאים לכם עכשיו. אפשר לשנות אותו בזמן הציור.',
      'Не обязательно всё объяснять словами. Можно прозвучать, подвигаться, нарисовать или написать.': 'לא חייבים להסביר הכול במילים. אפשר להשמיע קול, לנוע, לצייר או לכתוב.',
      'Можно выбрать несколько слов или написать своё.': 'אפשר לבחור כמה מילים או לכתוב משהו משלכם.',
      'Можно одной фразой. Можно оставить пустым.': 'אפשר לכתוב משפט אחד, ואפשר גם להשאיר ריק.',
      'Можно иногда присылать новости и новые практики.': 'אפשר לשלוח לי מדי פעם חדשות ותרגולים חדשים.',
      'Можно использовать обезличенные данные об использовании сервиса для улучшения продукта. Содержимое записей не входит.': 'אפשר להשתמש בנתוני שימוש אנונימיים לשיפור המוצר. תוכן הרשומות אינו נכלל.',
      'Личное пространство для саморефлексии: заметить состояние, выразить его голосом, движением, рисунком или текстом и снова заметить себя.': 'מרחב אישי להתבוננות עצמית: לשים לב למצב, לבטא אותו בקול, בתנועה, בציור או בטקסט, ואז לשים לב לעצמכם מחדש.',
      'Эмоциональный дневник — Мария Красилова': 'יומן רגשי — מריה קרסילובה',
      'Практик за 30 дней': 'תרגולים ב־30 הימים האחרונים',
      'Стало легче': 'הרגשתי הקלה',
      'Чаще выбираю': 'הבחירה הנפוצה שלי',
      'Всего записей': 'סך כל הרשומות',
      'Здесь появятся ваши первые записи.': 'הרשומות הראשונות שלכם יופיעו כאן.',
      'Заметила/заметил:': 'שמתי לב:',
      'интерес': 'עניין',
      'напряжение': 'מתח',
      'тревожно': 'חרדה',
      'злюсь': 'כעס',
      'устала/устал': 'עייפות',
      'Не удалось включить микрофон. Проверьте разрешение браузера.': 'לא ניתן לגשת למיקרופון. בדקו את הרשאת הדפדפן.',
      'Не удалось включить камеру/микрофон. Проверьте разрешения браузера.': 'לא ניתן לגשת למצלמה או למיקרופון. בדקו את הרשאות הדפדפן.',
      'Ты заметила своё состояние и дала ему место. Этого достаточно.': 'שמת לב למה שהרגשת ונתת לזה מקום. זה מספיק.',
      'Сначала выберите способ выражения': 'בחרו תחילה דרך ביטוי',
      'Отметьте, как вам после практики': 'סמנו איך אתם מרגישים אחרי התרגול',
      'Напишите хотя бы несколько слов': 'כתבו לפחות כמה מילים',
      'Сначала запишите голос': 'הקליטו תחילה את הקול',
      'Сначала запишите движение': 'הקליטו תחילה את התנועה'
    }
  };
  if (dictionaries.ru) {
    Object.assign(dictionaries.ru.en || (dictionaries.ru.en = {}), editorialOverrides.en);
    Object.assign(dictionaries.ru.he || (dictionaries.ru.he = {}), editorialOverrides.he);
  }
  const templates = {
    en: [
      [/^Верно!\s+(.+)$/, (_, rest) => `Correct! ${rest}`],
      [/^Правильный ответ:\s*(.+)$/, (_, rest) => `Correct answer: ${rest}`],
      [/^Уровень\s+(\d+)$/, (_, level) => `Level ${level}`],
      [/^(\d+) задан(?:ие|ия|ий)$/, (_, count) => `${count} tasks`],
      [/^(\d+)\/10 до уровня (\d+)$/, (_, score, level) => `${score}/10 to level ${level}`],
      [/^Задание (\d+) из (\d+)$/, (_, current, total) => `Task ${current} of ${total}`],
      [/^Уровень завершён: (\d+) из (\d+)$/, (_, score, total) => `Level complete: ${score} of ${total}`],
      [/^интенсивность (.+)$/, (_, rest) => `intensity ${rest}`],
      [/^Импровизация:\s*(.+)$/, (_, name) => `Improvisation: ${name}`],
      [/^Сейчас (\d+) (?:звука|звуков)\. Послушай и повтори\.$/, (_, count) => `Now ${count} notes. Listen and repeat.`],
      [/^Я не смог уверенно услышать все (\d+) звука\. Попробуй разделить их маленькими паузами\.$/, (_, count) => `I could not clearly hear all ${count} notes. Try separating them with short pauses.`]
    ],
    he: [
      [/^Верно!\s+(.+)$/, (_, rest) => `נכון! ${rest}`],
      [/^Правильный ответ:\s*(.+)$/, (_, rest) => `התשובה הנכונה: ${rest}`],
      [/^Уровень\s+(\d+)$/, (_, level) => `רמה ${level}`],
      [/^(\d+) задан(?:ие|ия|ий)$/, (_, count) => `${count} משימות`],
      [/^(\d+)\/10 до уровня (\d+)$/, (_, score, level) => `${score}/10 עד רמה ${level}`],
      [/^Задание (\d+) из (\d+)$/, (_, current, total) => `משימה ${current} מתוך ${total}`],
      [/^Уровень завершён: (\d+) из (\d+)$/, (_, score, total) => `הרמה הושלמה: ${score} מתוך ${total}`],
      [/^интенсивность (.+)$/, (_, rest) => `עוצמה ${rest}`],
      [/^Импровизация:\s*(.+)$/, (_, name) => `אלתור: ${name}`],
      [/^Сейчас (\d+) (?:звука|звуков)\. Послушай и повтори\.$/, (_, count) => `עכשיו ${count} צלילים. הקשיבו וחזרו.`],
      [/^Я не смог уверенно услышать все (\d+) звука\. Попробуй разделить их маленькими паузами\.$/, (_, count) => `לא הצלחתי לשמוע בבירור את כל ${count} הצלילים. נסו להפריד ביניהם בהפסקות קצרות.`]
    ]
  };
  const textState = new WeakMap();
  const attributeState = new WeakMap();
  let observer;
  let scheduled = false;

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/site-language.css';
  document.head.appendChild(style);

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function selectedLanguage() {
    const queryLanguage = new URLSearchParams(location.search).get('lang');
    let storedLanguage;
    try {
      storedLanguage = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_GAME_KEY);
    } catch (_) {
      storedLanguage = null;
    }
    const candidate = queryLanguage || storedLanguage || sourceLanguage;
    return SUPPORTED.has(candidate) ? candidate : sourceLanguage;
  }

  let activeLanguage = selectedLanguage();

  function lookup(value, targetLanguage) {
    if (targetLanguage === sourceLanguage) return value;
    const key = normalize(value);
    const exact = dictionaries[sourceLanguage]?.[targetLanguage]?.[key];
    if (exact) return exact;
    if (sourceLanguage === 'ru') {
      for (const [pattern, replacement] of templates[targetLanguage] || []) {
        if (pattern.test(key)) return key.replace(pattern, replacement);
      }
    }
    return value;
  }

  function preserveSpacing(source, translated) {
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    return leading + translated + trailing;
  }

  function shouldSkip(element) {
    if (!element) return true;
    if (element.closest('script,style,noscript,code,pre,[data-no-translate],[translate="no"]')) return true;
    if (element.closest('[data-user-content]')) return true;
    return false;
  }

  function translateTextNode(node) {
    const parent = node.parentElement;
    if (shouldSkip(parent) || !normalize(node.nodeValue)) return;
    let state = textState.get(node);
    if (!state || node.nodeValue !== state.lastOutput) {
      state = { source: node.nodeValue, lastOutput: node.nodeValue };
      textState.set(node, state);
    }
    const translated = lookup(state.source, activeLanguage);
    const output = translated === state.source ? state.source : preserveSpacing(state.source, translated);
    if (node.nodeValue !== output) node.nodeValue = output;
    state.lastOutput = output;
  }

  const regularAttributes = ['placeholder', 'aria-label', 'title', 'alt'];

  function translateAttribute(element, name) {
    if (shouldSkip(element) || !element.hasAttribute(name)) return;
    let states = attributeState.get(element);
    if (!states) {
      states = {};
      attributeState.set(element, states);
    }
    const current = element.getAttribute(name) || '';
    let state = states[name];
    if (!state || current !== state.lastOutput) {
      state = { source: current, lastOutput: current };
      states[name] = state;
    }
    const output = lookup(state.source, activeLanguage);
    if (current !== output) element.setAttribute(name, output);
    state.lastOutput = output;
  }

  function translateElement(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && shouldSkip(root)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node);
    const elements = root.nodeType === Node.ELEMENT_NODE
      ? [root, ...root.querySelectorAll('[placeholder],[aria-label],[title],[alt]')]
      : [...document.querySelectorAll('[placeholder],[aria-label],[title],[alt]')];
    elements.forEach((element) => regularAttributes.forEach((name) => translateAttribute(element, name)));
  }

  function translateMetadata() {
    document.querySelectorAll(
      'meta[name="description"],meta[name="twitter:title"],meta[name="twitter:description"],meta[property^="og:"]'
    ).forEach((meta) => translateAttribute(meta, 'content'));
  }

  function renderSwitcher() {
    let switcher = document.querySelector('.maria-language-switch');
    if (!switcher) {
      switcher = document.createElement('div');
      switcher.className = 'maria-language-switch';
      switcher.setAttribute('role', 'group');
      switcher.setAttribute('aria-label', 'Language / Язык / שפה');
      switcher.setAttribute('translate', 'no');
      switcher.dataset.noTranslate = '';
      switcher.innerHTML = [
        '<button type="button" data-site-lang="ru" aria-label="Русский">RU</button>',
        '<button type="button" data-site-lang="en" aria-label="English">EN</button>',
        '<button type="button" data-site-lang="he" aria-label="עברית">עברית</button>'
      ].join('');
      document.body.appendChild(switcher);
      switcher.addEventListener('click', (event) => {
        const button = event.target.closest('[data-site-lang]');
        if (button) setLanguage(button.dataset.siteLang);
      });
    }
    switcher.classList.toggle('has-bottom-nav', Boolean(document.querySelector('.nav')));
    switcher.querySelectorAll('[data-site-lang]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.siteLang === activeLanguage));
    });
  }

  function applyLanguage(language, emitEvent) {
    activeLanguage = SUPPORTED.has(language) ? language : sourceLanguage;
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = activeLanguage === 'he' ? 'rtl' : 'ltr';
    translateElement(document);
    translateMetadata();
    renderSwitcher();
    if (emitEvent) {
      window.dispatchEvent(new CustomEvent('maria:languagechange', {
        detail: { language: activeLanguage, sourceLanguage }
      }));
    }
  }

  function setLanguage(language) {
    if (!SUPPORTED.has(language)) return;
    try {
      localStorage.setItem(STORAGE_KEY, language);
      localStorage.setItem(LEGACY_GAME_KEY, language);
    } catch (_) {
      // Translation still works for the current page when storage is unavailable.
    }
    applyLanguage(language, true);
  }

  function scheduleTranslation(records) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      records.forEach((record) => {
        if (record.type === 'characterData') translateTextNode(record.target);
        record.addedNodes?.forEach((node) => translateElement(node));
        if (record.type === 'attributes') translateAttribute(record.target, record.attributeName);
      });
    });
  }

  window.MariaLanguage = {
    getCurrent: () => activeLanguage,
    set: setLanguage,
    translate: (value) => lookup(value, activeLanguage),
    refresh: () => applyLanguage(activeLanguage, false)
  };

  try {
    localStorage.setItem(STORAGE_KEY, activeLanguage);
  } catch (_) {}
  applyLanguage(activeLanguage, true);
  observer = new MutationObserver(scheduleTranslation);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['placeholder', 'aria-label', 'title', 'alt']
  });
})();
