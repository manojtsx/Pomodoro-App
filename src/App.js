import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { clear } from "@testing-library/user-event/dist/clear";

function App() {
  // define timer states with values 'Running', 'Stopped' and 'Ended'
  const timerStates = {
    Running : 'Running',
    Stopped : 'Stopped',
    Ended : 'Ended'
  };

  // define timer intervals pomodoro and shortbreak as arrays
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // define timers object with object properties pomodoro and shortBreak

  //  each property object should have properties:
  //  type, timeout, timerState, timeLeft, timeLeftDisplay and message
  const timers = {
    pomodoro: {
      type: "Pomodoro",
      timeout: 25 * 60,
      timerState: timerStates.Stopped,
      timeLeft: 25 * 60,
      timeLeftDisplay: formatTime(25 * 60),
      message: "Focus on your task",
    },
    shortBreak: {
      type: "Short Break",
      timeout: 5 * 60,
      timerState: timerStates.Stopped,
      timeLeft: 5 * 60,
      timeLeftDisplay: formatTime(5 * 60),
      message: "Take a short break",
    },
  };

  // Call useState Hook to manage 'currentTimer' state
  const [currentTimer, setCurrentTimer] = useState(timers.pomodoro);


  
  
  // Call useEffect Hook to update currentTimer state as timer interval expires 

  useEffect(() => {
    let intervalId;
  
    if (currentTimer.timerState === timerStates.Running) {
      intervalId = setInterval(() => {
        setCurrentTimer((prevTimer) => {
          const newTimeLeft = prevTimer.timeLeft - 1;
          return {
            ...prevTimer,
            timeLeft: newTimeLeft >= 0 ? newTimeLeft : 0,
            timeLeftDisplay: formatTime(newTimeLeft),
          };
        });
      }, 1000);
    } else if (currentTimer.timerState === timerStates.Stopped) {
      clearInterval(intervalId); // Clear the interval when stopped
    }
  
    return () => clearInterval(intervalId);
  }, [currentTimer.timerState]);
  

  // define startTimer() function to start timer and update currentTimer state

  const startTimer = () => {
    if (currentTimer.timerState === timerStates.Stopped || currentTimer.timerState === timerStates.Ended) {
      setCurrentTimer((prevTimer) => ({
        ...prevTimer,
        timerState: timerStates.Running,
      }));
    }
  };
  
  // define endTimer() function to end current timer and navigate to next timer

//   const endTimer = () =>{
// //    setCurrentTimer(timerStates[1]);  
//    setCurrentTimer({ ...currentTimer, timerState: timerStates.Stopped });
//   } 

const endTimer = () => {
    setCurrentTimer((prevTimer) => ({
      ...prevTimer,
      timerState: timerStates.Ended,
    }));
    
    // Automatically switch to the other timer (Pomodoro or Short Break) after ending
    setTimeout(() => {
      const nextTimer = currentTimer.type === timers.pomodoro.type ? timers.shortBreak : timers.pomodoro;
      setCurrentTimer(nextTimer);
    }, 2000); // Set a timeout for transitioning (2 seconds in this example)
  };
  
  
  // define navigateToTimer() function to update currentTimer state with given timer
  const navigateToTimer = (timerType) =>{
    const selectedTimer = timers[timerType];
    if(selectedTimer){
        setCurrentTimer(timers[timerType]);
    }
  }
  // define navigateToNextTimer() function to update currentTimer with next timer state
  const navigateToNextTimer = () =>{
    setCurrentTimer((prevTimer)=>{
        if(prevTimer === timers.pomodoro.type){
            return timers.shortBreak;
        }else if(prevTimer === timers.shortBreak.type){
            return timers.pomodoro;
        }
        return prevTimer;
    })
  }
  // define stopTimer() function to pause the current timer and update the currentTimer state
  const stopTimer = () => {
    setCurrentTimer((prevTimer) => ({
      ...prevTimer,
      timerState: timerStates.Stopped,
    }));
  };
  
  // DO NOT MODIFY THE BELOW CODE, ELSE THE TEST CASES WILL FAIL
  return (
    <div>
      <header>Pomodoro</header>
      <div className="timer-box">
        <div className="timer-box-tabs">
          <button
            id="btn-pd-timer"
            onClick={navigateToTimer.bind(null, timers.pomodoro.type)}
            className={
              currentTimer.type === timers.pomodoro.type
                ? "btn--tab btn--active"
                : "btn--tab"
            }
          >
            Pomodoro
          </button>
          <button
            id="btn-sb-timer"
            onClick={navigateToTimer.bind(null, timers.shortBreak.type)}
            className={
              currentTimer.type == timers.shortBreak.type
                ? "btn--tab btn--active"
                : "btn--tab"
            }
          >
            Short Break
          </button>
        </div>
        <div id="timer">{currentTimer.timeLeftDisplay}</div>
        <div className="timer-controls">
          {currentTimer.timerState == timerStates.Stopped ? (
            <button
              className="btn btn--control"
              onClick={startTimer}
              id="btn-start-timer"
            >
              start
            </button>
          ) : (
            <>
              <button
                className="btn btn--control"
                onClick={stopTimer}
                id="btn-stop-timer"
              >
                stop
              </button>
              <button
                className="btn btn--control"
                onClick={endTimer}
                id="btn-end-timer"
              >
                end
              </button>
            </>
          )}
        </div>
      </div>
      <div className="message-container">
        <div id="message">{currentTimer.message}</div>
      </div>
    </div>
  );
}
export default App;
