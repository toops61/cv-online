import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import questionPicture from '../../assets/ressourcesMemory/question.svg';

export default function Memory() {
  const [showAlert, setShowAlert] = useState(false);
  const [randomArray, setRandomArray] = useState([]);
  const [play, setPlay] = useState(false);
  const [finished, setFinished] = useState(false);
  
  const handlePlay = () => setPlay(true);

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
          <p>{convertTimer(timer)}</p>
      </div>
    )
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
        console.log(cardsPlayed);
        if (cardsPlayed.length < 2) {
          const array = [...arrayCards];
          array[props.index].turned = true;
          setArrayCards([...array]);
          handlePlay();
          checkPair();
          setTotalShots(totalShots+1);
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
        <p>Nombre de coups : {totalShots}</p>
        <div className="cards-container">
          {arrayCards.map((imagePicture,index) => <Card imagePicture={imagePicture} key={uuidv4()} index={index} />)}
        </div>
      </>
    )
  }

  const resetAll = () => {
    setPlay(false);
    getImages();
  }

  return (
    <div className="memory-page">
      {showAlert && <div class="alert-window">
        <div className="alert-container">
          <h2></h2>
          <h4>Meileurs temps</h4>
          <div className="best-timers">
          </div>
          <button className="close">X</button>
          <button className="reset-all">reset all scores</button>
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
