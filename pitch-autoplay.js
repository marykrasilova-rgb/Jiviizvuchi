// Continuous flow for the pitch-direction game: answer -> next question -> next melody.
function finishPitchAuto(){
  $('pitchFinish').innerHTML=`Готово! <strong>${pitchScore}/10</strong>`;
  $('pitchFinish').classList.remove('hidden');
  $('playPitch').classList.add('hidden');
  pitchAnswersBox.classList.add('hidden');
  $('nextPitch').classList.add('hidden');
}

handlePitchGuess=function(btn,guess){
  if(pitchLocked)return;
  pitchLocked=true;
  const correct=guess===pitchAnswer;
  btn.classList.add(correct?'correct':'wrong');
  const right=pitchAnswersBox.querySelector(`[data-pitch-answer="${pitchAnswer}"]`)||pitchAnswersBox.querySelector(`[data-pitch="${pitchAnswer}"]`);
  if(right)right.classList.add('correct');
  if(correct){
    pitchScore++;
    $('pitchScore').textContent=pitchScore;
  }
  if(typeof showGameReward==='function')showGameReward(correct);
  $('nextPitch').classList.add('hidden');

  if(pitchRound>=10){
    finishPitchAuto();
    return;
  }

  // Keep this in the same tap/click gesture so iPhone/Safari can autoplay the next sound.
  pitchRound++;
  newPitch();
  playSeq(pitchNotes,.42,'sine');
};

// The old manual button is kept only as an invisible fallback in the markup.
$('nextPitch').classList.add('hidden');