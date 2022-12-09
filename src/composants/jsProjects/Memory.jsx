import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import questionPicture from '../../assets/ressourcesMemory/question.svg';

export default function Memory() {
  const [randomArray, setRandomArray] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [play, setPlay] = useState(false);
  const [finished, setFinished] = useState({coups:0,time:'',date:''});
  const [finishMessage, setFinishMessage] = useState('');
  const [arrayTimers, setArrayTimers] = useState(localStorage.timersMemory ? JSON.parse(localStorage.getItem('timersMemory')) : []);
  
  const handlePlay = () => setPlay(true);

  const convertTimeToSeconds = time => {
    const minutes = time.split(':')[0]*60;
    const seconds = time.split(':')[1]/1;
    return minutes+seconds;
  };

  const handleScores = lastObject => {
    const array = [...arrayTimers];
    array.length > 9 && array.splice(10,1);
    array.push(lastObject);
    array.length > 1 && array.sort((a,b) => convertTimeToSeconds(a.time)-convertTimeToSeconds(b.time));
    localStorage.setItem('timersMemory',JSON.stringify(array));
    setArrayTimers([...array]);
  }

  const displayBestTimers = object => {
    setShowAlert(true);
    setFinishMessage(`BRAVO !!! c\'est gagné.${(arrayTimers.length && convertTimeToSeconds(arrayTimers[0].time) > convertTimeToSeconds(object.time)) ? ' Record battu, vous avez le meilleur temps !!' : ''}`)
  }

  const BestTimers = () => {
    return (
      <div className="best-timers">
        {arrayTimers.length && arrayTimers.map(el => {
          return <div  className="timer-classment" key={uuidv4()}>
            {el.date === finished.date && <div className="present-timer"></div>}
            <p>Date: {el.date}</p>
            <p>Nombre de coups: {el.coups}</p>
            <p>Temps: {el.time}</p>
          </div>
        })}
      </div>
    )
  }

const resetAllScores = () => {
  if (window.confirm('Voulez-vous vraiment effacer tous les scores ?')) {
    const array = [];
    setArrayTimers([...array]);
    localStorage.setItem('timersMemory',JSON.stringify(array));
    setShowAlert(false);
    resetAll();
  }
}

  const getImages = () => {
    const importAll = r => {
      return r.keys().map(r);
    }
    let images = importAll(require.context('../../assets/ressourcesMemory', false, /\.(png|jpe?g|svg)$/));
    images = images.filter(e => !e.includes('question'));
    let array = images.map((el,index) => {
      return {
        id:`image${index}`,
        url:el
      }
    })
    randomImages(array);
  }

  const randomImages = array => {
    let tempArray = [];
    do {
      const index = Math.floor(Math.random() * array.length);
      tempArray.filter(e => e === array[index]).length < 2 && tempArray.push(array[index]);
    } while (tempArray.length < array.length*2);
    tempArray = tempArray.map(el => {
      return {...el,turned:false,keep:false}
    })
    setRandomArray([...tempArray]);
  }

  useEffect(() => {
    getImages();
  }, [])

  const Timer = () => {
    const [timer, setTimer] = useState(0);
    useEffect(() => {
      let timerInterval;
  
      if (play) {
        timerInterval = setInterval(() => {
          setTimer(timer => timer + 1);
        }, 1000);
      } else if (timer !== 0) {
         const tempObject = {...finished};
         tempObject.time = convertTimer(timer);
         setFinished({...tempObject});
      }
  
      return () => {
        clearInterval(timerInterval);
      }
    },[play])

    const convertTimer = timer => {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      const timerToDisplay = `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
      return timerToDisplay;
    }

    return (
      <div className="chrono-container">
          <p>{finished.time ? finished.time : convertTimer(timer)}</p>
      </div>
    )
  }

  const endGame = totalShots => {
    const tempObject = {...finished};
    tempObject.time = document.querySelector('.chrono-container p').textContent;
    tempObject.coups = totalShots;
    tempObject.date = new Date().toLocaleString()
    setFinished({...tempObject})
    handleScores(tempObject);
    setPlay(false);
    displayBestTimers(tempObject);
  }

  const CardSection = () => {
    const [arrayCards, setArrayCards] = useState([]);
    const [totalShots, setTotalShots] = useState(0);

    useEffect(() => {
      randomArray.length && setArrayCards([...randomArray]);
    }, [randomArray])

    useEffect(() => {
      play && setTotalShots(totalShots+1);
    }, [play])

    const checkPair = () => {
      const arrayPlayed = arrayCards.filter(e => e.turned && !e.keep);
      if (arrayPlayed.length === 2) {
        if (arrayPlayed[0].id === arrayPlayed[1].id) {
          const index = arrayPlayed[0].id;
          const newArray = arrayCards.map(el => {
            if (el.id === index) {
              return {...el,keep:true};
            } else {
              return el;
            }
          });
          setArrayCards([...newArray]);
          newArray.every(el => el.keep) && endGame(totalShots);
        } else {
          const newArray = arrayCards.map(el => {
            if (el.turned && !el.keep) {
              return {...el,turned:false};
            } else {
              return el;
            }
          });
          setTimeout(() => {
            setArrayCards([...newArray]);
          }, 800);
        }
      }
    }
    
    const Card = props => {

      const flipCard = () => {
        const cardsPlayed = arrayCards.filter(e => e.turned && !e.keep);
        const array = [...arrayCards];
        if (cardsPlayed.length < 2 && !array[props.index].turned) {
          array[props.index].turned = true;
          document.querySelectorAll('.card')[props.index].classList.add('flip')
          setTimeout(() => {
            !play && handlePlay();
            setArrayCards([...array]);
            checkPair();
            setTotalShots(totalShots+1);
          }, 500);
        }
      }
      
      return (
        <div className="sub-container">
          <div className={props.imagePicture.turned ? "card flip" : "card"} onClick={flipCard}>
            <div className="card-back">
              <img src={questionPicture} alt="question" />
            </div>
            <div className="card-front">
              <img src={props.imagePicture.url} alt="hidden" />
            </div>
          </div>
        </div>
      )
    }
  
    return (
      <>
        <p>Nombre de coups : {finished.coups ? finished.coups : totalShots}</p>
        <div className="cards-container">
          {arrayCards.map((imagePicture,index) => <Card imagePicture={imagePicture} key={uuidv4()} index={index} />)}
        </div>
      </>
    )
  }

  const resetAll = () => {
    setPlay(false);
    getImages();
    setFinished({coups:0,time:'',date:''});
  }

  return (
    <div className="memory-page">
      {showAlert && <div className="alert-window">
        <div className="alert-container">
          <h2>{finishMessage}</h2>
          {arrayTimers.length && 
          <>
            <h4>Meilleurs temps</h4>
            <BestTimers />
          </>}
          <button className="close" onClick={e => setShowAlert(false)}>X</button>
          <button className="reset-all" onClick={resetAllScores}>reset all scores</button>
        </div>
      </div>}
      <main className="memory-main">
        <h1>Jeu des <span>cartes mémoires</span></h1>
        <h2>Tentez le meilleur temps.</h2>
        <CardSection />
        <button className="reset-button" onClick={resetAll}><h3>reset</h3></button>
        <Timer />
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
