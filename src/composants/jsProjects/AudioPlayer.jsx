import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateGeneralParams } from "../../redux";

export default function AudioPlayer() {
  const [repeat, setRepeat] = useState('');
  const [songsArray, setSongsArray] = useState([]);
  const [play, setPlay] = useState(false);
  const [timerAudio, setTimerAudio] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.1);
  const [songSelected, setSongSelected] = useState({
    id:1,
    url:'',
    artist:'',
    song:'',
    album:'',
    pictureURL:''
  });
  //const [jsmediatags, setJsmediatags] = useState('');
  const jsmediatags = window.jsmediatags;

  const getSongs = () => {
    const importAll = r => {
      return r.keys().map(r);
    }
    let songs = importAll(require.context('../../assets/songs', false, /\.(mp3|m4a|webp|wav|aiff)$/));
    //images = images.filter(e => !e.includes('question'));
    let array = songs.map((el,index) => {
      return {
        id:index+1,
        url:el
      }
    })
    setSongsArray([...array]);
    const tempSongObject = {...songSelected,...array[0]};
    setSongSelected({...tempSongObject});
  }

  useEffect(() => {
    const timerPlay = setInterval(() => {
      play && setTimerAudio(timerVideo => timerVideo+1);
    }, 1000);

    audioRef.current && (play ? audioRef.current.play() : audioRef.current.pause());

    return () => {
      clearInterval(timerPlay);
    }
  }, [play])

  const audioRef = useRef();

  const getCover = tags => {
    const data = tags.picture.data;
    const format = tags.picture.format;
    let base64String = "";
    data.map(e => base64String += String.fromCharCode(e));
    const imageUrl = `data:${format};base64,${window.btoa(base64String)}`;
    return imageUrl;
  }

  //check songs metadata
const getTags = async () => {
  const targetUrl = audioRef.current.src;
  return await jsmediatags.read(targetUrl, {
    onSuccess: tag => {
      const songTags = tag.tags;
      const tempSongObject = {
        ...songSelected,
        artist:songTags.artist,
        album:songTags.album,
        song:songTags.title,
        pictureURL:getCover(songTags)
      }
      setSongSelected({...tempSongObject});
    },
    onError: error => console.log(error)
  })
}

const formatTime = time => {
  let seconds = Math.round(time%60);
  seconds < 10 && (seconds = '0' + seconds);
  const formatted = Math.floor(time / 60) + ':' + seconds;
  return formatted;
};

const getDuration = () => {
  setDuration(audioRef.current.duration);
};

  const dispatch = useDispatch();

  useEffect(() => {
    getSongs();
    dispatch(updateGeneralParams({ darkMode: true }));
  }, [])
  
  useEffect(() => {
    if (songsArray.length) {
      audioRef.current.volume = volume;
    }
  }, [songsArray])

  useEffect(() => {
    if (audioRef.current) {
      getTags();
    }
  }, [songSelected])
  
  const handlePlay = e => {
    setPlay(!play);
  }

  document.querySelector(".button-container")?.classList.add("hide");

  return (
    <div className="audio-player-page">
      <main className="player-body">
        <div className="player-back">
          <div className="triangle-corner"></div>
        </div>
        <div className="player-front"></div>
        <div className="volume-buttons">
          <button className="volume"></button>
          <button className="volume"></button>
        </div>
        {songsArray.length && <audio src={songsArray[0].url} className="song" ref={audioRef} onDurationChange={getDuration}></audio>}
        <section className="screen-container">
          {songSelected.pictureURL ? <img src={songSelected.pictureURL} alt="cover" /> : <div className="no-picture"></div>}
        </section>
        <section className="title-container">
          <div className="title">
            <h1>{songSelected.artist}</h1>
            <p>{songSelected.song}</p>
            <p>{songSelected.album}</p>
          </div>
          <div className="title-number"><p>{`${songSelected.id}/${songsArray.length}`}</p></div>
        </section>
        <section className="progressbar-container">
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <div className="time">
            <p>0:00</p>
            <p>{formatTime(duration)}</p>
          </div>
        </section>
        <section className="controls-container">
          <div className="random"></div>
          <button className="backward"></button>
          <button className={play ? "play-pause active" : "play-pause"} onClick={handlePlay}>
            <div className="play"></div>
            <div className="pause"></div>
          </button>
          <button className="forward"></button>
          <div className={repeat ? "repeat selected" : "repeat"}>
            {repeat === 'one' && <p>1</p>}
          </div>
        </section>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
