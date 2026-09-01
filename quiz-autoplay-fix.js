// Composer quiz: after a correct answer, advance immediately and start the next excerpt from the same tap.
(function(){
  const nextButton=document.getElementById('nextQuiz');
  if(nextButton)nextButton.style.display='none';

  answerComposer=function(btn,name){
    if(quizLocked||!currentWork)return;
    const correct=name===currentWork.composer;

    if(!correct){
      btn.classList.add('wrong');
      btn.disabled=true;
      $('quizFeedback').textContent='Пока нет. Послушай ещё раз или выбери другой вариант.';
      if(typeof showGameReward==='function')showGameReward(false);
      return;
    }

    quizLocked=true;
    stopNatural();
    btn.classList.add('correct');
    quizScore++;
    $('quizScore').textContent=quizScore;
    document.querySelectorAll('#composerAnswers button').forEach(b=>b.disabled=true);
    if(typeof showGameReward==='function')showGameReward(true);

    // Keep the transition inside the user's tap event so mobile Safari is more likely
    // to allow the next recording to start without another press.
    if(quizRound>=10){
      $('quizFeedback').textContent=`Верно! ${currentWork.composer} — ${currentWork.work}.`;
      finishQuiz();
      return;
    }

    quizRound++;
    naturalNewQuiz(false);
    $('quizFeedback').textContent='';
    playCurrentQuiz();
  };
})();
