import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Pomodoro() {
  document.querySelector('.button-container')?.classList.add('hide');
  
  const [workTimer, setWorkTimer] = useState(1800);
  const [restTimer, setRestTimer] = useState(300);
  const [timerPlaying, setTimerPlaying] = useState('work');
  const [cycle, setCycle] = useState(0);
  const [play, setPlay] = useState(false);

  const formatTimer = timer => {
    const minutes = Math.floor(timer / 60);
    const secondes = timer % 60;
    return `${minutes}:${secondes >= 10 ? secondes : ('0'+secondes)}`;
  }

  const endCycle = () => {
    setWorkTimer(1800);
    setRestTimer(300);
    setTimerPlaying('work');
    setCycle(cycle+1);
  }

  useEffect(()=>{
    let timerWorkInterval;
    let timerRestInterval;

    if (play) {
      timerPlaying === 'work' && (timerWorkInterval = setInterval(() => {
        setWorkTimer(workTimer => workTimer - 1);
      }, 1000));

      timerPlaying === 'rest' && (timerRestInterval = setInterval(() => {
        setRestTimer(restTimer => restTimer - 1);
      }, 1000));
    }

    return () => {
      clearInterval(timerWorkInterval);
      clearInterval(timerRestInterval);
    }
  },[play,timerPlaying])

  useEffect(() => {
    workTimer === 0 && setTimerPlaying('rest');
  }, [workTimer])

  useEffect(() => {
    restTimer === 0 && endCycle();
  }, [restTimer])
  

  const resetTimers = () => {
    setTimerPlaying('work');
    setPlay(false);
    setCycle(0);
    setWorkTimer(1800);
    setRestTimer(300);
  }

  return (
    <div className="pomodoro-page">
      <main className="pomodoro-main">
      <div className="title">
        <p>Le </p><h1>POMODORO</h1>
      </div>
      <section className="timers-container">
        <div className="timer work">
          <div className="title-container">
            <h2>Travail</h2>
            <div></div>
          </div>
          <p className="work__time">{formatTimer(workTimer)}</p>
        </div>
        <div className="timer rest">
          <div className="title-container">
            <h2>Repos</h2>
            <div></div>
          </div>
          <p className="rest__time">{formatTimer(restTimer)}</p>
        </div>
      </section>
      <section className="buttons-container">
        <button className={play ? "pause" : "play"} onClick={e => setPlay(!play)}></button>
        <button className="reset" onClick={resetTimers}></button>
      </section>
      <p className="cycle-container">Cycle : {cycle}</p>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
