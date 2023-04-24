import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateGeneralParams } from "../../redux";

export default function AudioPlayer() {
  const [repeat, setRepeat] = useState('');
  const [random, setRandom] = useState(false);
  const [songsArray, setSongsArray] = useState([]);
  const [playedSongs, setPlayedSongs] = useState([]);
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

  //hide dark mode
  document.querySelector(".button-container")?.classList.add("hide");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateGeneralParams({ darkMode: true }));
    getSongs();
  }, [])

  const getSongs = () => {
    const importAll = r => {
      return r.keys().map(r);
    }
    let songs = importAll(require.context('../../assets/songs', false, /\.(mp3|m4a|wav|aiff)$/));
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
  const tempArray = [...songsArray];
  return await jsmediatags.read(targetUrl, {
    onSuccess: tag => {
      const songTags = tag.tags;
      const tempSongObject = {
        ...songSelected,
        artist:songTags.artist,
        album:songTags.album,
        song:songTags.title,
        pictureURL:songTags.picture ? getCover(songTags) : ''
      }
      setSongSelected({...tempSongObject});
      tempArray.splice(tempSongObject.id-1,1,tempSongObject);
      setSongsArray([...tempArray])
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
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      !songSelected.artist && getTags();
      play && audioRef.current.play();
      setTimerAudio(0);
    }
  }, [songSelected])

  //display progress bar
  const displayTimeBar = () => {
    const current = audioRef.current.currentTime;
    const progress = -100 + (current*100)/duration;
    return progress;
  }

  const jumpCurrent = e => {
    const clickPosition = e.nativeEvent.layerX;
    const barLength = document.querySelector('.progress-bar').offsetWidth;
    const x = Math.round((clickPosition * duration) / barLength);
    audioRef.current.currentTime = x;
    setTimerAudio(x);
  }

  useEffect(() => {
    const timerPlay = setInterval(() => {
      play && setTimerAudio(timerAudio => timerAudio+1);
    }, 1000);

    audioRef.current && (play ? audioRef.current.play() : audioRef.current.pause());

    return () => {
      clearInterval(timerPlay);
    }
  }, [play])
  
  useEffect(() => {
    if (timerAudio > 0 && !playedSongs.includes(songSelected.id)) {
      const tempArray = [...playedSongs];
       tempArray.push(songSelected.id);
       setPlayedSongs([...tempArray]);
    } 
    if (timerAudio > duration) {
      handleNext();
      repeat === 'one' && audioRef.current.play();
    }
  }, [timerAudio])
  

  const handlePlay = e => {
    if (!timerAudio && !play && songSelected.id === 1 && random) randomSong();
    setPlay(!play);
  }

  const randomSong = () => {
      const songNotPlayed = playedSongs.length === songsArray.length ? songsArray.map(e => e.id) : songsArray.map(e => !playedSongs.includes(e.id) && e.id).filter(el => el);
      if (songNotPlayed.length) {
        const index = songNotPlayed[Math.floor(Math.random() * songNotPlayed.length)];
        const tempSongObject = {
          id:'',
          url:'',
          artist:'',
          song:'',
          album:'',
          pictureURL:''
        }
        tempSongObject.id = index;
        tempSongObject.url = songsArray[index-1].url;
        setSongSelected(songsArray[index-1].artist ? {...songsArray[index-1]} : {...tempSongObject});
      }
  }

  const nextSong = () => {
    const tempSongObject = {
      id:'',
      url:'',
      artist:'',
      song:'',
      album:'',
      pictureURL:''
    }
    tempSongObject.id = songSelected.id === songsArray.length ? 1 : songSelected.id + 1;
    tempSongObject.url = songsArray[songSelected.id === songsArray.length ? 0 : songSelected.id].url;
    songSelected.id === songsArray.length && setPlayedSongs([]);
    setSongSelected(songsArray[tempSongObject.id-1].artist ? {...songsArray[tempSongObject.id-1]} : {...tempSongObject});
  }
  
  const handleNext = () => {
    if (!random && repeat !== 'one') {
      if (songSelected.id === songsArray.length && repeat === '') setPlay(false);
      nextSong();
    } else if (random && repeat !== 'one') {
      if (playedSongs.length === songsArray.length) {
        repeat !== 'all' && setPlay(false);
        setPlayedSongs([]);
      }
      randomSong();
    } else if (repeat === 'one') {
      audioRef.current.currentTime = 0;
      setTimerAudio(0);
    }
  }

  const previousSong = () => {
    if (timerAudio === 0 && songSelected.id > 1) {
      const tempSongObject = {
        id:'',
        url:'',
        artist:'',
        song:'',
        album:'',
        pictureURL:''
      }
      songSelected.id !== 1 && (tempSongObject.id = songSelected.id - 1);
      songSelected.id !== 1 && (tempSongObject.url = songsArray[songSelected.id-2].url);
      setSongSelected(songsArray[tempSongObject.id-1].artist ? {...songsArray[tempSongObject.id-1]} : {...tempSongObject});
    } else if (timerAudio !== 0) {
      setTimerAudio(0);
      audioRef.current.currentTime = 0;
    }
  }

  const handlePrevious = e => {
    previousSong();
  }

  const handleRepeat = e => {
    switch (repeat) {
      case '':
        setRepeat('all');
        break;
      case 'all':
        setRepeat('one');
        break;
      case 'one':
        setRepeat('');
        break;
      default:
        break;
    }
  }

  return (
    <div className="audio-player-page">
      <main className="player-body">
        <div className="player-back">
          <div className="triangle-corner"></div>
        </div>
        <div className="player-front"></div>
        <div className="volume-buttons">
          <button className="volume" onClick={e => volume < 1 && setVolume(Math.ceil((volume*10)+1)/10)}></button>
          <button className="volume" onClick={e => volume > 0 && setVolume(Math.ceil(volume*10-1)/10)}></button>
        </div>
        {songSelected.url && <audio src={songSelected.url} className="song" ref={audioRef} onDurationChange={getDuration}></audio>}
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
          <div className="progress-bar" onClick={jumpCurrent}>
            <div className="progress" style={{transform:`translateX(${audioRef.current ? displayTimeBar() : 0}%)`}}></div>
          </div>
          <div className="time">
            <p>{formatTime(timerAudio)}</p>
            <p>{formatTime(duration)}</p>
          </div>
        </section>
        <section className="controls-container">
          <div className={random ? "random active" : "random"} onClick={e => setRandom(!random)}></div>
          <button className="backward" onClick={handlePrevious}></button>
          <button className={play ? "play-pause active" : "play-pause"} onClick={handlePlay}>
            <div className="play"></div>
            <div className="pause"></div>
          </button>
          <button className="forward" onClick={handleNext}></button>
          <div className={repeat ? "repeat selected" : "repeat"} onClick={handleRepeat}>
            {repeat === 'one' && <p>1</p>}
          </div>
        </section>
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
