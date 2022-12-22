import { useRef } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import videoShintou from '../../assets/Shintou_montage.mp4';

export default function VideoPlayer() {
  document.querySelector(".button-container")?.classList.add("hide");
  
  const [play, setPlay] = useState(false);
  const [volume, setVolume] = useState(2);
  const [timerVideo, setTimerVideo] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = time => {
    let seconds = Math.round(time%60);
    seconds < 10 && (seconds = '0' + seconds);
    const formatted = Math.floor(time / 60) + ':' + seconds;
    return formatted;
  };

  const videoRef = useRef();

  const getDuration = () => {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = .5;
  };

  useEffect(() => {
    const timerPlay = setInterval(() => {
      play && setTimerVideo(timerVideo => timerVideo+1);
    }, 1000);

    videoRef.current && (play ? videoRef.current.play() : videoRef.current.pause());

    return () => {
      clearInterval(timerPlay);
    }
  }, [play])
  
  useEffect(() => {
    if (timerVideo && timerVideo > duration) {
      setPlay(false);
      setTimerVideo(0);
      videoRef.current.currentTime = 0;
    }
  }, [timerVideo])
  

  useEffect(() => {
    videoRef.current && (videoRef.current.volume = volume/10);
  }, [volume])
  
  const scrollTime = e => {
    const value = e.target.value;
    videoRef.current.currentTime = value;
    setTimerVideo(value/1);
  }

  const fullScreenFunc = () => {
    if (!document.fullscreenElement) {
      document.querySelector('.video-container').requestFullscreen()
      .catch((err) => {
        alert(`Il y a eu un problème sur le mode plein écran: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div className="video-player-page">
      <main className="video-player-main">
        <h1>Lecteur <span>personnalisé</span></h1>
        <section className="player-container">
            <div className="video-container">
              <div className="play-screen" onClick={e => setPlay(!play)}></div>
              <video src={videoShintou}  ref={videoRef} onDurationChange={getDuration}></video>
              <div className="controls-section">
                  <button className={play ? "pause" : "play"} onClick={e => setPlay(!play)}></button>
                  <button className={`volume ${volume === '0' ? 'off' : (volume > 4 ? 'high' : 'low')}`}>
                      <input type="range" name="scroll-volume" id="scroll-volume" min="0" max="10" onChange={e => setVolume(e.target.value)} value={volume} />
                  </button>
                  <div className="time-container">
                      <p className="actual-time">{formatTime(timerVideo)}</p>
                  </div>
                  <input 
                    type="range" 
                    name="scroll-time" 
                    id="scroll-time" 
                    min="0" 
                    max={Math.ceil(duration)} 
                    onChange={scrollTime}
                    value={timerVideo}
                  />
                  <p className="total-time">{formatTime(duration)}</p>
                  <button className="full-screen" onClick={fullScreenFunc}></button>
              </div>
            </div>
        </section>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
