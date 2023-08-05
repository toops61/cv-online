import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Loader from "../../components/Loader";
import { useInfiniteQuery } from "react-query";

export default function Scroll() {
  document.querySelector('.button-container')?.classList.remove('hide');
  const [apiKey, setApiKey] = useState('');
  const [apiStored, setApiStored] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [showArrow, setShowArrow] = useState(false);

  const observerCard = useRef();

  useEffect(() => {
    if(localStorage.apiUnsplash) {
      const apiStoredResult = localStorage.getItem('apiUnsplash');
      apiStoredResult && setApiKey(localStorage.getItem('apiUnsplash'));
    }
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
        fetchNextPage();
        console.log('photos call');
      }
    })
  });

  const displayMessageError = message => {
    setErrorMessage(message);
    setSearchError(true);
    setTimeout(() => {
      setSearchError(false);
    }, 3000);
  }

  /* const callApiPhotos = async () => {
    console.log('CALL API');
    setShowLoader(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchInput}&client_id=${apiKey}&page=${pageNumber}&per_page=30`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const jsonResult = await response.json();
      const array = localStorage.arrayPhotos ? JSON.parse(localStorage.getItem('arrayPhotos')) : [];
      jsonResult.results.map(e => array.push(e));
      localStorage.setItem('arrayPhotos',JSON.stringify(array));
      setPageNumber(Math.ceil(array.length/30));
      setArrayPhotos([...array]);
      !array.length && displayMessageError('Aucun résultat pour cette recherche, essayez autre chose.');
      setShowLoader(false);
    } catch (error) {
      console.error(error);
      setShowLoader(false);
      displayMessageError('Il y a eu une erreur, réessayez.');
    }
  } */

  const handleData = data => {
    try {
      const array = [];
      data.pages.map(e => {
        e && e.results?.map(photo => array.push(photo));
      });
    } catch (error) {
      console.log(error);
    }
    return data
  }

  const fetchFunc = async ({ pageParam = 1 }) => {
    const url = `https://api.unsplash.com/search/photos?query=${searchInput}&client_id=${apiKey}&page=${pageParam}&per_page=30`;
    const result = searchWord && apiKey && pageParam ? await fetch(url) : '';
    return result ? result.json() : '';
  }
  
  const {
      isLoading,
      isError,
      error,
      data,
      fetchNextPage
    }
   = useInfiniteQuery(['imagesScroll',searchWord],fetchFunc, {
      getNextPageParam: (_lastPage, pages) => {
        const nextPage = pages.length+1;
        return searchWord && apiKey ? nextPage : undefined;
      },
      select: data => handleData(data),
      cacheTime: 1800000,
      staleTime:1800000
  })
  
  if (data && data.pageParams.length !== pageNumber) setPageNumber(data.pageParams.length);

  const handleInput = e => setSearchInput(e.target.value);

  const onSubmitSearch = e => {
    e.preventDefault();
    setSearchWord(e.target[0].value);
  }
  
  useEffect(() => {
    console.log(searchWord);
    searchWord && fetchNextPage();
  }, [searchWord])
  
  useEffect(() => {
    isError && displayMessageError(error);
  }, [isError])

  useEffect(() => {
    data && console.log(data);
  }, [data])
  
  useEffect(() => {
    if (data) {
      console.log(observerCard);
      let photoTarget = '';
      pageNumber && (photoTarget = observerCard.current);
      if (photoTarget) {
        observer.observe(photoTarget);
      } 
    }
  }, [data])

  const checkScroll = e => setShowArrow(window.scrollY > 320 ? true : false);

  document.addEventListener('scroll', checkScroll);

  const Cards = () => {
    const array = [];
    data && data.pages.map(e => {
      e && e.results?.map(photo => array.push(photo));
    });
    
    return (
      <section className="photos-container">
        {isLoading ? <Loader /> : <></>}
        {array.length ? array.map((photo,index) => {
          return (
            <div className="photo-card" key={uuidv4()} ref={(pageNumber && index===29*pageNumber) ? observerCard : null}>
              <img src={photo.urls.small} alt={photo.alt_description} />
            </div>
          )
        }): <></>}
      </section>
    )
  }

  //cleanup function
  useEffect(() => {    
    return () => {
      observer && observer.disconnect();
      document.removeEventListener('scroll', checkScroll);
      //delete observer;
    }
  })

  return (
    <div className="scroll-page">
      <main className="main-scroll">
        <form className="input-api" onSubmit={handleApiKey}>
          {apiKey ? <div className="check-input">
            <h2>Vous avez déjà une clé d'API</h2>
            <input type="checkbox" name="modify-key" id="modify-key" onChange={handleStored} />
            <label htmlFor="modify-key">Modifier</label>
          </div> : <></>}
          {(apiStored || !apiKey) ? <div className="input-key">
            <label htmlFor="api-access">Entrez votre cle d'API : </label>
            <input type="password" name="api-access" id="api-access" />
            <button className="valid-api"></button>
          </div> : <></>}
          {!apiKey ? <p>Obtenez votre clé d'API <a href="https://unsplash.com/oauth/applications">ici</a></p> : <></>}
        </form>
        <h1>Clone Unsplash</h1>
        <form className="search-bar" onSubmit={onSubmitSearch}>
          <label htmlFor="search">Votre recherche</label>
          <div className="input-search">
            <input type="text" name="search" id="search" onChange={handleInput} value={searchInput} />
            <button className="search-button"></button>
          </div>
          {searchError ? <p className="error-message">{errorMessage}</p> : <></>}
        </form>
        <Cards />
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
      {showArrow ? <div className="arrow" onClick={e => window.scrollTo({top:0,left:0,behavior: 'smooth'})}></div> : <></>}
    </div>
  )
}