import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Morpion() {
  document.querySelector('.button-container')?.classList.add('hide');

  const [player1Turn, setPlayer1Turn] = useState(true);
  const [playerNames, setPlayerNames] = useState({
    player1Name: 'joueur1',
    player2Name: 'joueur2'
  })
  const [playedArray, setPlayedArray] = useState([]);
  const [winner, setWinner] = useState('');

  const winArray = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  const resetArray = () => {
    const array = [];
    for (let ind = 0; ind < 9; ind++) {
      array.push('');
    }
    setPlayedArray([...array]);
  }

  useEffect(() => {
    resetArray();
  }, [])
  

  const getNames = e => {
    const tempObject = {...playerNames};
    tempObject[e.target.id] = e.target.value;
    setPlayerNames({...tempObject});
  }

  const checkWinner = array => {
    winArray.map(e => {
        if (array[e[0]] === array[e[1]] && array[e[1]] === array[e[2]] && array[e[0]]) {
            setWinner(player1Turn ? playerNames.player1Name : playerNames.player2Name);
        };
    })
  }

  const handleCase = ind => {
    const tempArray = [...playedArray];
    if (!tempArray[ind] && !winner) {
      tempArray.splice(ind,1,(player1Turn ? 'O' : 'X'));
      checkWinner(tempArray);
      setPlayer1Turn(!player1Turn);
    }
    setPlayedArray([...tempArray]);
  }

  const resetGame = () => {
    setPlayer1Turn(true);
    resetArray();
    setWinner('');
  }

  return (
    <div className="morpion-page">
      <main className="main-morpion">
        <button className="reset" onClick={resetGame}>reset</button>
        <h1><span>le</span> Morpion</h1>
        <form className="names">
          <div className="input-container">
            <label htmlFor="player1Name">Nom du joueur 1</label>
            <input type="text" name="player1Name" id="player1Name" className="input-names" onChange={getNames} />
          </div>
          <div className="input-container">
            <label htmlFor="player2Name">Nom du joueur 2</label>
            <input type="text" name="player2Name" id="player2Name" className="input-names" onChange={getNames} />
          </div>
        </form>
        <section className="playground">
          <div className="line">
            <div className="case" onClick={e => handleCase(0)}><p>{playedArray[0]}</p></div>
            <div className="case" onClick={e => handleCase(1)}><p>{playedArray[1]}</p></div>
            <div className="case" onClick={e => handleCase(2)}><p>{playedArray[2]}</p></div>
          </div>
          <div className="line">
            <div className="case" onClick={e => handleCase(3)}><p>{playedArray[3]}</p></div>
            <div className="case" onClick={e => handleCase(4)}><p>{playedArray[4]}</p></div>
            <div className="case" onClick={e => handleCase(5)}><p>{playedArray[5]}</p></div>
          </div>
          <div className="line">
            <div className="case" onClick={e => handleCase(6)}><p>{playedArray[6]}</p></div>
            <div className="case" onClick={e => handleCase(7)}><p>{playedArray[7]}</p></div>
            <div className="case" onClick={e => handleCase(8)}><p>{playedArray[8]}</p></div>
          </div>
        </section>
        {!winner && <p className="player-turn">Au tour de {player1Turn ? playerNames.player1Name : playerNames.player2Name}</p>}
        {winner && <h2 className="winner animate">BRAVO !! Le gagnant est {winner}</h2>}
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
