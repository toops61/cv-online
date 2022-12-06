import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import questionPicture from '../../assets/ressourcesMemory/question.svg';

export default function Memory() {
  const [showAlert, setShowAlert] = useState(false);
  const [arrayImages, setArrayImages] = useState([]);
  const [randomArray, setRandomArray] = useState([]);
  const [totalShots, setTotalShots] = useState(0);
  const [timer, setTimer] = useState(0);
  
  function importAll(r) {
    return r.keys().map(r);
  }
  
  useEffect(() => {
    let images = importAll(require.context('../../assets/ressourcesMemory', false, /\.(png|jpe?g|svg)$/));
    images = images.filter(e => !e.includes('question'));
    let array = images.map((el,index) => {
      return {
        id:`image${index}`,
        url:el
      }
    })
    setArrayImages([...array]);
    randomImages(array);
  }, [])
  
  const convertTimer = timer => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const timerToDisplay = `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
    return timerToDisplay;
  }

  const randomImages = array => {
    const tempArray = [];
    do {
      const index = Math.floor(Math.random() * array.length);
      tempArray.filter(e => e === array[index]).length < 2 && tempArray.push(array[index]);
    } while (tempArray.length < array.length*2);
    setRandomArray([...tempArray]);
  }

  const ImageCard = props => {
    const [turned, setTurned] = useState(false)
    const flipCard = () => {
      setTurned(true);
    }
    return(
      <div className="sub-container">
        <div className={turned ? "card flip" : "card"} onClick={flipCard}>
          <div className="card-back">
            <img src={questionPicture} alt="question" />
          </div>
          <div className="card-front">
            <img src={props.imageUrl} alt="hidden" />
          </div>
        </div>
      </div>
    )
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
        <p>Nombre de coups : {totalShots}</p>
        <div className="cards-container">
          {randomArray.map(el => <ImageCard imageUrl={el.url} key={uuidv4()} />)}
        </div>
        <button className="reset-button"><h3>reset</h3></button>
        <div className="chrono-container">
          <p>{convertTimer(timer)}</p>
        </div>
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
