import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import wikiLogo from '../../assets/perso_proj/wiki-logo.png';

export default function WikiApp() {
  document.querySelector('.button-container').classList.remove('hide');
  const [showLoader, setShowLoader] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [numberOfSearch, setNumberOfSearch] = useState(1);
  const [searchResults, setSearchResults] = useState({});
  const [showErrorWindow, setShowErrorWindow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fillSearchInput = e => {
    setSearchInput(e.target.value);
  }

  const handleErrorWindow = message => {
    setShowErrorWindow(!showErrorWindow);
    setErrorMessage(message);
  };

  const ResultContainer = () => {
    const array = [...searchResults];
    return (
      <div className="result-container">
        {array.map(result => {
          return (
            <div className="result-card"  key={uuidv4()}>
              <a href={`https://en.wikipedia.org/?curid=${result.pageid}`} target='_blank' rel='noreferrer'>
                <h2>{result.title}</h2>
              </a>
              <p dangerouslySetInnerHTML={{__html: result.snippet}}></p>
            </div>
          )
        })}
      </div>
    )
  }

  const searchQuery = async () => {
      setShowLoader(true);
      try {
          const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=${numberOfSearch}&srsearch=${searchInput}`);
          if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
          }
          const json = await response.json();
          setSearchResults(json.query.search);
          setShowLoader(false);
        }
        catch(error) {
          setShowLoader(false);
          console.error(error);
          handleErrorWindow('Pas de résultat');
      }
  }

  const searchWord = () => {
    if (searchInput && numberOfSearch > 0 && numberOfSearch <= 50) {
      searchQuery()
    } else if (!searchInput) {
       handleErrorWindow('Attention, remplissez la barre de recherche');
    } else {
      numberOfSearch < 1 && handleErrorWindow('Vous devez mettre au moins un résultat');
      numberOfSearch > 50 && handleErrorWindow('Vous ne pouvez dépasser 50 résultats');
    }
  };

  useEffect(() => {
    showErrorWindow && 
    setTimeout(() => {
      handleErrorWindow();
    }, 3000);
  }, [showErrorWindow])

  return (
    <main className="wiki-page">
      {showLoader && <div className="loader">
        <div className="point-container">
          <div className="point"></div>
          <div className="point"></div>
          <div className="point"></div>
        </div>
      </div>}
      {showErrorWindow && <div className="error-window">
        <div className="error">
          <p>{errorMessage}</p>
        </div>
      </div>}
      <section>
        <div className="logo">
          <img src={wikiLogo} alt="wikipedia" />
        </div>
        <label htmlFor="searchInput"><h1>Recherche <span>Wikipedia</span></h1></label>
        <div className="search">
          <input type="text" id="searchInput" name="searchInput" placeholder="nouvelle recherche" onInput={fillSearchInput} value={searchInput} />
          <div className="reset" onClick={e => setSearchInput('')}><p>X</p></div>
          <button type="submit" onClick={searchWord} ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" /></svg></button>
        </div>
        <div className="number-results-container">
          <label htmlFor="number-search">Nombre de résultats</label>
          <input 
            type="number" 
            name="number-search" 
            id="number-search" 
            min="1" 
            max="50"
            onInput={e => setNumberOfSearch(e.target.value)} 
            value={numberOfSearch} 
          />
        </div>
        {searchResults.length && <ResultContainer />}
      </section>
      <Link to="/MaulaveStephane/Projects">
          <button className="previous-page"></button>
      </Link>
    </main>
  )
}
