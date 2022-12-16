import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function Typing() {
  document.querySelector('.button-container')?.classList.add('hide');

  const APIEndpoint = "https://api.quotable.io/random";
  const [typingSentence, setTypingSentence] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [validButton, setValidButton] = useState('');
  const [timer, setTimer] = useState(60);
  const [playTimer, setPlayTimer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalValidate, setTotalValidate] = useState(0);
  const [typingScoresArray, setTypingScoresArray] = useState(localStorage.typeScores ? JSON.parse(localStorage.getItem('typeScores')) : []);

  const getSentence = async () => {
      try {
          const response = await fetch(APIEndpoint);
          if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
          }
          const data = await response.json();
          setTypingSentence(data.content);
      } catch (error) {
          console.log(`Il y a eu une erreur, rechargez : ${error.message} (${error.name})`);
      }
  }

  useEffect(() => {
    getSentence();
  }, [])

  useEffect(() => {
    let timerInterval;
    !timer && endGame();

    if (playTimer && timer) {
      timerInterval = setInterval(() => {
        setTimer(timer => {
          !timer && setPlayTimer(false);
          return timer ? timer - 1 : 0
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    }
  },[playTimer])

  const DisplayScores = () => typingScoresArray.map(el => <p key={uuidv4()}>{el.date} : {el.score}</p>);

  //add score to best scores array and sort
const handleScores = () => {
  const tempArray = [...typingScoresArray];
  tempArray.length > 9 && tempArray.pop();
  tempArray.push({score: score, date: new Date().toLocaleString()});
  tempArray.sort((a,b) => b.score-a.score);
  localStorage.setItem('typeScores',JSON.stringify(tempArray));
  setTypingScoresArray([...tempArray]);
}

const closeAlert = () => {
  resetGame();
  setAlertVisible(false);
}

const endGame = () => {
  setAlertVisible(true);
  setAlertText(`${(typingScoresArray.length && score >= typingScoresArray[0].score) ? 'Meilleur' : 'Fin du'} chrono : vous avez tapé ${score} lettres`);
  handleScores();
}

  const validSentence = valid => valid && setScore(typedInput.length + totalValidate);
  
  //compare typed sentence with suggested one
  const compareSentences = e => {
    if (timer) {
        const textEntered = e.target.value;
        setTypedInput(textEntered);
        timer === 60 && setPlayTimer(true);
        let valid = false;
        if (textEntered.length === 1) {
            valid = textEntered === typingSentence[0] ? true : false;
        } else if (textEntered.length > 1) {
            valid = typingSentence.includes(textEntered) ? true : false;
        }
        textEntered && setValidButton(valid ? 'valid' : 'invalid');
        //typed != from '' => validSentence() and colorParts()
        textEntered && validSentence(valid);
        
        if (textEntered === typingSentence) {
            setTotalValidate(totalValidate + textEntered.length);
            getSentence();
            setTypedInput('');
        }
    }
  }

  const resetGame = () => {
    setPlayTimer(false);
    setTimer(60);
    setScore(0);
    setTypedInput('');
    setValidButton('');
    setTotalValidate(0);
    getSentence();
  }

  return (
    <div className="typing-page">
      <main className="typing-main">
        {alertVisible && <div className="alert-window">
          <div className="alert-container">
            <p className="end-game">{alertText}</p>
            <h4>Meilleurs scores</h4>
            <div className="best-timers">
              {typingScoresArray.length && <DisplayScores />}
            </div>
            <button className="close-button" onClick={closeAlert}>X</button>
          </div>
        </div>}
        {validButton === 'valid' && <div className="valid-button valid"></div>}
        {validButton === 'invalid' && <div className="valid-button invalid"><p>X</p></div>}
        <button className="reset-button" onClick={resetGame}>Reset</button>
        <section className="top">
          <h1>Petite frappe... <span>⌨️</span></h1>
          <p>Tapez le plus vite possible !</p>
          <div className="counters-container">
            <div className="counter">
              <p className="timer">Temps : {timer}</p>
            </div>
            <div className="counter">
              <p className="score">Score : {score}</p>
            </div>
          </div>
        </section>
        <section className="typing-container">
          <textarea name="sentence" id="sentence" cols="30" rows="10" onChange={compareSentences} value={typedInput}></textarea>
          <p className="typing-sentence">{typingSentence}</p>
        </section>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
