import { useEffect, useState } from "react";

export default function Typing() {
  const APIEndpoint = "http://api.quotable.io/random";
  const [typingSentence, setTypingSentence] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

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
  

  return (
    <div className="typing-page">
      <main className="typing-main">
        {alertVisible && <div className="alert-window">
          <div className="alert-container">
            <p className="end-game"></p>
            <h4>Meilleurs temps</h4>
            <div className="best-timers"></div>
            <button className="close-button" onClick={e => setAlertVisible(false)}>X</button>
          </div>
        </div>}
        <div className="valid-button hide"></div>
        <div className="valid-button hide"><p>X</p></div>
        <button className="reset-button">Reset</button>
        <section className="top">
          <h1>Petite frappe... <span>⌨️</span></h1>
          <p>Tapez le plus vite possible !</p>
          <div className="counters-container">
            <div className="counter">
              <p className="timer">Temps 0</p>
            </div>
            <div className="counter">
              <p className="score">Score : 0</p>
            </div>
          </div>
        </section>
        <section className="typing-container">
          <textarea name="sentence" id="sentence" cols="30" rows="10"></textarea>
          <p className="typing-sentence">{typingSentence}</p>
        </section>
      </main>
    </div>
  )
}
