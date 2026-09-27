(function () {
  'use strict';

  const tracks = window.CENTURY21_TRACKS || [];
  const byId = id => document.getElementById(id);
  const hub = byId('modernHub');
  const game = byId('century21Game');
  const open = byId('century21Open');
  const back = byId('century21Back');
  const listen = byId('century21Listen');
  const answers = byId('century21Answers');
  const feedback = byId('century21Feedback');
  const next = byId('century21Next');
  const finish = byId('century21Finish');
  if (!tracks.length || !hub || !game || !open || !back || !listen || !answers || !feedback || !next || !finish) return;

  let order = [];
  let round = 0;
  let score = 0;
  let firstTry = true;
  let answered = false;
  let player = null;
  let playbackId = 0;

  function shuffle(values) {
    const copy = values.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function stopAudio() {
    playbackId++;
    if (player) {
      player.pause();
      player.removeAttribute('src');
      player.load();
      player = null;
    }
    listen.disabled = false;
    listen.innerHTML = '▶<span>Слушать</span>';
  }

  function setAnswerEnabled(enabled) {
    answers.querySelectorAll('button').forEach(button => {
      if (!button.dataset.wrong) button.disabled = !enabled;
    });
  }

  function showRound() {
    stopAudio();
    answered = false;
    firstTry = true;
    feedback.textContent = 'Нажми «Слушать», чтобы услышать фрагмент.';
    next.classList.add('hidden');
    finish.classList.add('hidden');
    byId('century21Round').textContent = `${round + 1}/${order.length}`;
    byId('century21Score').textContent = String(score);
    answers.replaceChildren();

    const current = order[round];
    const otherArtists = shuffle(tracks.filter(track => track.artist !== current.artist)).slice(0, 3);
    shuffle([current, ...otherArtists]).forEach(track => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = track.artist;
      button.disabled = true;
      button.addEventListener('click', () => answer(track, button));
      answers.appendChild(button);
    });
  }

  function answer(track, button) {
    if (answered || button.disabled) return;
    const current = order[round];
    if (track.id !== current.id) {
      firstTry = false;
      button.dataset.wrong = 'true';
      button.disabled = true;
      feedback.textContent = 'Попробуй ещё раз. Можно послушать фрагмент повторно.';
      return;
    }

    answered = true;
    if (firstTry) score++;
    byId('century21Score').textContent = String(score);
    setAnswerEnabled(false);
    feedback.replaceChildren();
    const reveal = document.createElement('div');
    reveal.className = 'century21-reveal';
    const heading = document.createElement('strong');
    heading.textContent = firstTry ? 'Верно! +1 очко' : 'Верно!';
    const work = document.createElement('span');
    work.textContent = `${current.artist} — ${current.title} (${current.year})`;
    const source = document.createElement('a');
    source.href = current.source;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = `Оригинал и автор · ${current.license}`;
    reveal.append(heading, work, source);
    feedback.appendChild(reveal);
    next.textContent = round === order.length - 1 ? 'Посмотреть результат →' : 'Следующий фрагмент →';
    next.classList.remove('hidden');
  }

  function showFinish() {
    stopAudio();
    answers.replaceChildren();
    feedback.textContent = '';
    next.classList.add('hidden');
    listen.classList.add('hidden');
    finish.classList.remove('hidden');
    finish.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = `Игра окончена: ${score} из ${order.length}`;
    const message = document.createElement('p');
    message.textContent = 'Все десять фрагментов прозвучали. Сыграй ещё раз, чтобы узнать авторов лучше.';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'primary';
    retry.textContent = 'Играть ещё раз';
    retry.addEventListener('click', start);
    finish.append(title, message, retry);
  }

  function start() {
    stopAudio();
    order = shuffle(tracks);
    round = 0;
    score = 0;
    hub.classList.add('hidden');
    game.classList.remove('hidden');
    listen.classList.remove('hidden');
    showRound();
    game.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  open.addEventListener('click', start);
  back.addEventListener('click', () => {
    stopAudio();
    game.classList.add('hidden');
    hub.classList.remove('hidden');
    hub.scrollIntoView({behavior: 'smooth', block: 'start'});
  });
  next.addEventListener('click', () => {
    if (!answered) return;
    if (round === order.length - 1) showFinish();
    else { round++; showRound(); }
  });
  listen.addEventListener('click', () => {
    if (!order.length) return;
    stopAudio();
    const id = playbackId;
    const audio = new Audio();
    player = audio;
    audio.preload = 'auto';
    audio.volume = 1;
    audio.src = order[round].audio;
    listen.disabled = true;
    listen.innerHTML = '◌<span>Загрузка…</span>';
    audio.addEventListener('ended', () => {
      if (id !== playbackId) return;
      listen.disabled = false;
      listen.innerHTML = '▶<span>Слушать ещё</span>';
    });
    // play() stays inside the tap handler so iOS permits playback.
    audio.play().then(() => {
      if (id !== playbackId) return;
      listen.disabled = false;
      listen.innerHTML = '↻<span>Начать заново</span>';
      if (!answered) {
        setAnswerEnabled(true);
        feedback.textContent = 'Кто создал эту музыку?';
      }
    }).catch(() => {
      if (id !== playbackId) return;
      listen.disabled = false;
      listen.innerHTML = '▶<span>Повторить</span>';
      feedback.replaceChildren();
      feedback.append('Не удалось воспроизвести. Попробуй ещё или ');
      const link = document.createElement('a');
      link.href = order[round].audio;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'открой фрагмент отдельно';
      feedback.append(link, '.');
    });
  });
})();
