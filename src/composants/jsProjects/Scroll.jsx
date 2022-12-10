import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function Scroll() {
  const [apiKey, setApiKey] = useState('');
  const [apiStored, setApiStored] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(0);
  const [arrayPhotos, setArrayPhotos] = useState([]);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if(localStorage.apiUnsplash) {
      const apiStoredResult = JSON.parse(localStorage.getItem('apiUnsplash'));
      apiStoredResult && setApiKey(JSON.parse(localStorage.getItem('apiUnsplash')));
    }
    const arrayStored = localStorage.arrayPhotos ? [...JSON.parse(localStorage.getItem('arrayPhotos'))] : [];
    setArrayPhotos([...arrayStored]);
  }, [])

  const handleStored = () => {
    setApiStored(!apiStored);
  }

  const handleApiKey = e => {
    e.preventDefault();
    const inputsArray = Array.from(e.target);
    const access =  inputsArray.filter(e => e.id === "api-access")[0].value;
    localStorage.setItem('apiUnsplash',JSON.stringify(access));
    setApiKey(access);
  }

  const observer = new IntersectionObserver(entries => {
    entries.map(e => {
        //when card is visible load new page of pictures if search bar filled and skip previous target
        if (e.isIntersecting) {
          observer.unobserve(e.target);
          searchInput && callApiPhotos();
        }
    })
});

useEffect(() => {
  let photoTarget = '';
  page && (photoTarget = document.querySelectorAll('.photo-card')[page*25]);
  if (photoTarget) {
    observer.observe(photoTarget);
  } 
}, [arrayPhotos])

  const displayMessageError = message => {
    setErrorMessage(message);
    setSearchError(true);
    setTimeout(() => {
      setSearchError(false);
    }, 3000);
  }

  const callApiPhotos = async () => {
    console.log('CALL API');
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchInput}&client_id=${apiKey}&page=${page+1}&per_page=30`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const jsonResult = await response.json();
      const array = localStorage.arrayPhotos ? JSON.parse(localStorage.getItem('arrayPhotos')) : [];
      jsonResult.results.map(e => array.push(e));
      localStorage.setItem('arrayPhotos',JSON.stringify(array));
      setPage(Math.ceil(array.length/30));
      setArrayPhotos([...array]);
      !array.length && displayMessageError('Aucun résultat pour cette recherche, essayez autre chose.');
    } catch (error) {
      console.error(error);
      displayMessageError('Il y a eu une erreur, réessayez.');
    }
  }

  const handleInput = e => setSearchInput(e.target.value);

  const searchQuery = e => {
    e.preventDefault();
    localStorage.setItem('arrayPhotos',JSON.stringify([]));
    setArrayPhotos([]);
    searchInput ? callApiPhotos() : displayMessageError('votre recherche est vide...');
  }

  const checkScroll = e => setShowArrow(window.scrollY > 320 ? true : false);

  document.addEventListener('scroll', checkScroll);

  const Cards = () => {
    return (
      <section className="photos-container">
        {arrayPhotos.length && arrayPhotos.map(photo => {
          return (
            <div className="photo-card" key={uuidv4()}>
              <img src={photo.urls.small} alt={photo.alt_description} />
            </div>
          )
        })}
      </section>
    )
  }

  return (
    <div className="scroll-page">
      <main className="main-scroll">
        <form className="input-api" onSubmit={handleApiKey}>
          {apiKey && <div className="check-input">
            <h2>Vous avez déjà une clé d'API</h2>
            <input type="checkbox" name="modify-key" id="modify-key" onChange={handleStored} />
            <label htmlFor="modify-key">Modifier</label>
          </div>}
          {(apiStored || !apiKey) && <div className="input-key">
            <label htmlFor="api-access">Entrez votre cle d'API : </label>
            <input type="password" name="api-access" id="api-access" />
            <button className="valid-api"></button>
          </div>}
          {!apiKey && <p>Obtenez votre clé d'API <a href="https://unsplash.com/oauth/applications">ici</a></p>}
        </form>
        <h1>Clone Unsplash</h1>
        <form className="search-bar" onSubmit={searchQuery}>
          <label htmlFor="search">Votre recherche</label>
          <div className="input-search">
            <input type="text" name="search" id="search" onChange={handleInput} value={searchInput} />
            <button className="search-button"></button>
          </div>
          {searchError && <p className="error-message">{errorMessage}</p>}
        </form>
        <Cards />
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
      {showArrow && <div className="arrow" onClick={e => window.scrollTo(0,0)}></div>}
    </div>
  )
}