const pulseButton = document.getElementById('movementPulse');
const status = document.getElementById('movementPulseStatus');
const durations = document.getElementById('movementPulseDurations');
const panel = document.getElementById('movementPanel');

if (pulseButton && status && durations && panel) {
  const heading = panel.querySelector('.small[style*="margin-top"]');
  if (heading) heading.innerHTML = '<b>Звук для движения</b>';

  const trackButton = document.createElement('button');
  trackButton.id = 'movementMariaTrack';
  trackButton.type = 'button';
  trackButton.className = 'btn secondary';
  trackButton.style.marginTop = '10px';
  trackButton.textContent = '▶ Трек Марии';
  pulseButton.insertAdjacentElement('afterend', trackButton);

  const audio = new Audio('/assets/audio/maria-c-movement-loop.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.78;
  let stopTimer = null;

  const minutes = () => Number(durations.querySelector('.chip.on')?.dataset.pulseMinutes || 3);
  const stopTrack = (message = null) => {
    clearTimeout(stopTimer);
    stopTimer = null;
    audio.pause();
    audio.currentTime = 0;
    trackButton.textContent = '▶ Трек Марии';
    if (message) status.textContent = message;
  };

  trackButton.addEventListener('click', async () => {
    if (!audio.paused) {
      stopTrack(`Выбрано: ${minutes()} мин · трек Марии`);
      return;
    }
    if (pulseButton.textContent.trim().startsWith('■')) pulseButton.click();
    try {
      await audio.play();
      const duration = minutes();
      trackButton.textContent = '■ Выключить трек Марии';
      status.textContent = `Звучит ${duration} мин · авторский трек Марии Красиловой`;
      stopTimer = setTimeout(() => stopTrack('Готово · трек мягко завершён'), duration * 60 * 1000);
    } catch (error) {
      status.textContent = 'Не удалось включить трек. Нажмите ещё раз или проверьте звук телефона.';
    }
  });

  pulseButton.addEventListener('click', () => {
    if (!audio.paused) stopTrack();
  }, true);

  durations.addEventListener('click', () => {
    if (audio.paused) status.textContent = `Выбрано: ${minutes()} мин · выберите пульс или трек Марии`;
  });

  status.textContent = 'Выберите длительность, затем мажорный пульс или трек Марии';
}
