import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { updateGeneralParams } from "../../redux";

export default function NasaPictures() {
    document.querySelector('.button-container')?.classList.remove('hide');

    const [imageUrl, setImageUrl] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [jsonResult, setJsonResult] = useState({});
    const [metadataJson, setMetadataJson] = useState({});

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

  const getMetadata = async () => {
    const items = jsonResult.collection.items;
    const metadataUrl = items.find(e => e.href.includes('metadata'))?.href;
    try {
        const response = await fetch(metadataUrl);
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
        getMetadata();
    }
  }, [jsonResult])
  

  return (
    <div className="nasa-page">
        <main className="nasa-main">
            {showLoader ? <Loader /> : null}
            <form>
                <label htmlFor="search-image">rechercher une image</label>
                <input type="text" name="search-image" id="search-image" />
            </form>
            <div className="picture-imported">
                <img src={imageUrl} alt="Nasa" />
            </div>
        </main>
        <Link to="/Projects">
            <button className="previous-page"></button>
        </Link>
    </div>
  )
}
