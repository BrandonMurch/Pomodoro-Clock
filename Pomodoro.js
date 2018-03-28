/*
  @description - Pomodoro clock, with the ability to adjust break time and work time.
  @input - Resetting clock, choosing which clock to use,
           Increasing and decreasing times by GUI.
  @author - Brandon - Brandon.Murch@protonmail.com
*/

let timer = {
  workTime : true,
  running : false,
  paused : false,
  secRemaining : 1500,
  current : undefined,
  circumRemaining : 0,
};

let interval, current, breakTime = 300, workTime = 1500;

const audio = new Audio('Computer_Magic-Microsift-1901299923.mp3');

const bigDisplay = (value) => { // changes html for large display in the center
  document.getElementsByClassName("ring__display")[0].innerHTML = formatTime(value);
}

const breakDisplay = (value) => {      //changes html for smaller left display
  document.getElementsByClassName("adjustTime__displayNumber--break")[0].innerHTML = formatTime(value);
}

const workDisplay = (value) => {      //changes html for smaller right display
  document.getElementsByClassName("adjustTime__displayNumber--work")[0].innerHTML = formatTime(value);
}

const formatTime = (timeInSec) => {    // formats time into X:XX:XX
  let hour, minute, second;
  if (timeInSec >= 3600){
    hour = Math.floor(timeInSec/3600);
    minute = (Math.floor(timeInSec%3600/60)).toString();
    second = (timeInSec%60).toString();
    return (hour + ":" + minute.padStart(2, '0') + ":" + second.padStart(2, '0'));
  }else if (timeInSec >= 60) {
    minute = Math.floor(timeInSec%3600/60);
    second = (timeInSec%60).toString();
    return (minute + ":" + second.padStart(2, '0'));
  }else{
    return timeInSec;
  }
};


              /*
              -   Countdown timer for work/break.
              -   Offset is an increasing number that removes the ring by degrees
                  based on the amount of time selected.
              -   circumference || 0 is for when the timer is paused, it restarts
                  in the same place by keeping track of the current offset with
                  timer.circumRemaining.
              -   finally the function toggles workTime, so it knows which timer
                  it is counting down.
              */
const initiateTimer = (time, message, circumference) => {
  let initialOffset = '880'-(circumference || 0); // circumference of the circle
  let i = time;
  interval = setInterval(() => {
      let offset = initialOffset-((i*(initialOffset/time))-(circumference || 0))
      $('.ring--animate').css('stroke-dashoffset', offset);
      timer.secRemaining = i
      timer.circumRemaining = offset;
      if (i > 0){
        bigDisplay(formatTime(i));
      } else {
        clearInterval(interval);
        bigDisplay(message);
        audio.play();
        timer.running = false;
        if (timer.workTime){
          timer.workTime = false;
        }else{
          timer.workTime = true;
        }
      }
      i--;
  }, 1000);
}



const resetTimer = () => {      // resets all default funcitons.
  clearInterval(interval);
  timer.running = false;
  timer.paused = false;
  timer.secRemaining = 0;
  timer.current = undefined;
  if (timer.workTime){
    bigDisplay(workTime);
  } else {
      bigDisplay(breakTime);
  }
  $('.ring--animate').css('stroke-dashoffset', 0);
}


                    // a series of listeners for button clicks on each button.
$(document).ready(function(){

  $(document).on("click",".button--reset",function(){
    resetTimer();
  });

  $(document).on("click",".adjustTime__title--break",function(){
    timer.workTime = false;
    resetTimer();
  });

  $(document).on("click",".adjustTime__title--work",function(){
    timer.workTime = true;
    resetTimer();
  });

  $(document).on("click",".adjustTime__plus--break",function(){
    breakTime += 60;
    breakDisplay(breakTime);
    if (!timer.workTime&& !timer.running){
      bigDisplay(breakTime);
    }
  });

  $(document).on("click",".adjustTime__minus--break",function(){
    if (breakTime >= 120){
      breakTime -= 60;
      breakDisplay(breakTime);
      if (!timer.workTime){
        bigDisplay(breakTime);
      }
    }
  });

  $(document).on("click",".adjustTime__plus--work",function(){
    workTime += 60;
    workDisplay(workTime);
    if (timer.workTime&& !timer.running){
      bigDisplay(workTime);
    }
  });

  $(document).on("click",".adjustTime__minus--work",function(){
    if (workTime >= 120){
      workTime -= 60;
      workDisplay(workTime);
      if (timer.workTime&& !timer.running){
        bigDisplay(workTime);
      }
    }
  });


  $(document).on("click",".ring",function(){
    if (!timer.running){
      timer.running = true;
      if (timer.workTime) {
        current = initiateTimer(workTime, "Break!");
      } else {
        current = initiateTimer(breakTime, "Work!");
      }
    } else if (timer.running && !timer.paused){ // pause timer
      timer.paused = true;
      clearInterval(interval);
    } else if(timer.running && timer.paused){   //restart timer from where it was paused
      timer.paused = false;
      if(timer.workTime){
        current = initiateTimer(timer.secRemaining, "Break!", timer.circumRemaining);
      } else {
        current = initiateTimer(timer.secRemaining, "Work!", timer.circumRemaining);
      }
    }
  });
});
