import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Loader from "../../components/Loader";
import { updateGeneralParams } from "../../redux";

export default function NasaPictures() {
    document.querySelector('.button-container')?.classList.remove('hide');

    const [imageUrl, setImageUrl] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [jsonResult, setJsonResult] = useState({});
    const [metadataJson, setMetadataJson] = useState({});
    const [input, setInput] = useState('');
    const [jsonSearchResult, setJsonSearchResult] = useState({});
    const [title, setTitle] = useState('JunoCam Image of Europa From Flyby');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateGeneralParams({darkMode:true}));
        apiCall();
    }, [])

//call meteo API
  const apiCall = async () => {
    setShowLoader(true);
    console.log('CALL API');
    try {
      const response = await fetch(`http://images-api.nasa.gov/asset/PIA25334`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const json = await response.json();
      sessionStorage.setItem("apiNasaResult", JSON.stringify(json));
      setJsonResult({...json});
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error(error);
    }
  };

//get metadata from API first call
  const getMetadata = async url => {
    try {
        const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const json = await response.json();
    setMetadataJson({...json});
    } catch (error) {
    console.error(error);
    }
  }

  useEffect(() => {
    if (jsonResult.collection && jsonResult.collection.items) {
        const items = jsonResult.collection.items;
        setImageUrl(items.find(e => e.href.includes('medium'))?.href);
        //const metadataUrl = items.find(e => e.href.includes('metadata'))?.href;
        //getMetadata(metadataUrl);
    }
  }, [jsonResult])

  useEffect(() => {
    const array = Object.values(metadataJson);
    let URL = '';
    if (array.length) {
        URL = array.find(el => el.includes('orig.mp4'));
        !URL && (URL = array.find(el => el.includes('small.jpg')));
        !URL && (URL = array.find(el => el.includes('orig.jpg')));
    }
    if (URL) {
        URL = URL.replaceAll(' ','%20');
        URL = URL.replaceAll('\'','%27');
    }
    URL && setImageUrl(URL);
  }, [metadataJson])

  const searchQuery = async () => {
    console.log('SEARCH ON API');
    try {
      const response = await fetch(`https://images-api.nasa.gov/search?q=${input}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const json = await response.json();
      sessionStorage.setItem("apiNasaSearchResult", JSON.stringify(json));
      setJsonSearchResult({...json});
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error(error);
    }
  }

  const searchImage = e => {
    e.preventDefault();
    searchQuery();
  }

  return (
    <div className="nasa-page">
        <main className="nasa-main">
            {showLoader ? <Loader /> : null}
            <form>
                <label htmlFor="search-image">rechercher une image</label>
                <input type="text" name="search-image" id="search-image" onChange={e => setInput(e.target.value)} value={input} />
                <button className="valid-search" onClick={searchImage}></button>
            </form>
            <div className="results-image">
                {jsonSearchResult.collection ? <div className="results-list">
                    <h3>{jsonSearchResult.collection.items.length ? 'Résultats' : 'Pas de résultat pour votre requête'}</h3>
                    {jsonSearchResult.collection.items.map((item,index) => {
                        return (
                            <p 
                            key={uuidv4()} 
                            onClick={() => {
                                getMetadata(item.href);
                                setTitle(item.data[0].description);
                            }} 
                            className="result">
                                {index} {item.data[0].title}
                            </p>
                        )
                    })}
                </div> : null}
                <div className="picture-imported">
                    {(imageUrl.includes('mp4') || imageUrl.includes('webm')) ? 
                    <video controls>
                        <source src={imageUrl} type="video/webm" />
                        <source src={imageUrl} type="video/mp4" />
                    </video> : 
                    <img src={imageUrl} alt="Nasa" />}
                    <h4>{title}</h4>
                </div>
            </div>
        </main>
        <Link to="/Projects">
            <button className="previous-page"></button>
        </Link>
    </div>
  )
}
