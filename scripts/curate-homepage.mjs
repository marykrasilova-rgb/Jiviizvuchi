import fs from 'node:fs';

const file = 'index.html';
let s = fs.readFileSync(file, 'utf8');

s = s.replace(`   <div class="card storyCard">\n    <img src="/assets/home/photo-05.webp" alt="Мария за чаем" loading="lazy">\n    <div class="copy"><h3>Бережный контакт</h3><p>В работе со мной важны не только практика и результат, но и ощущение безопасности в процессе.</p></div>\n   </div>\n   <div class="card storyCard">\n    <img src="/assets/home/photo-06.webp" alt="Мария на фоне неба" loading="lazy">\n    <div class="copy"><h3>Больше воздуха</h3><p>Моя задача — помочь вам почувствовать больше пространства внутри, а не загнать в ещё одну систему оценки.</p></div>\n   </div>`, `   <div class="card">\n    <h3>Бережный контакт</h3><p>В работе со мной важны не только практика и результат, но и ощущение безопасности в процессе.</p>\n   </div>\n   <div class="card">\n    <h3>Больше воздуха</h3><p>Моя задача — помочь вам почувствовать больше пространства внутри, а не загнать в ещё одну систему оценки.</p>\n   </div>`);

s = s.replace(`<section class="section">\n <div class="wrap splitFeature">\n  <div class="inlinePhoto"><img src="/assets/home/photo-07.webp" alt="Мария в городе" loading="lazy"></div>\n  <div>\n   <div class="eyebrow">Бесплатный вход</div>`, `<section class="section">\n <div class="wrap">\n  <div>\n   <div class="eyebrow">Бесплатный вход</div>`);

s = s.replaceAll('<span class="kicker">Творческий дневник</span>', '<span class="kicker">Эмоциональный дневник</span>');
s = s.replaceAll('<div class="cta"><a class="btn primary" href="/app.html">Открыть дневник</a></div>', '<div class="cta"><a class="btn primary" href="/diary">Открыть дневник</a></div>');

s = s.replace(`   <div class="card storyCard">\n    <img src="/assets/home/photo-03.webp" alt="Мария улыбается у клавиш" loading="lazy">\n    <div class="copy"><h3>Группа для живого опыта</h3><p>Здесь не нужно быть певцом. В центре — практика вариантов, взаимодействие, спонтанность и способность продолжать после ошибки.</p></div>\n   </div>`, `   <div class="card">\n    <h3>Группа для живого опыта</h3><p>Здесь не нужно быть певцом. В центре — практика вариантов, взаимодействие, спонтанность и способность продолжать после ошибки.</p>\n   </div>`);

s = s.replace(`<section class="section">\n <div class="wrap grid2">\n  <div class="inlinePhoto"><img src="/assets/home/photo-04.webp" alt="Мария за фортепиано" loading="lazy"></div>\n  <div class="banner">`, `<section class="section">\n <div class="wrap">\n  <div class="banner">`);

fs.writeFileSync(file, s, 'utf8');
for (const name of ['photo-05.webp', 'photo-06.webp', 'photo-07.webp']) {
  const p = `assets/home/${name}`;
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

const manifest = {
  active_photos: [
    {file:'photo-01.webp', alt:'Мария Красилова', placement:'hero'},
    {file:'photo-02.webp', alt:'Мария Красилова в культурном пространстве', placement:'about'},
    {file:'photo-03.webp', alt:'Мария за клавиатурой на фоне природы', placement:'about: Радость и свобода'},
    {file:'photo-04.webp', alt:'Мария за фортепиано в наушниках', placement:'about: Композиторское ухо'},
    {file:'photo-08.webp', alt:'Мария в библиотеке', placement:'musical portrait'}
  ],
  removed_as_repetitive_or_off_topic: ['photo-05.webp','photo-06.webp','photo-07.webp'],
  duplicate_placements_removed: ['photo-03.webp from group section','photo-04.webp from organizations section']
};
fs.writeFileSync('assets/home/photo-manifest.json', JSON.stringify(manifest, null, 2));
