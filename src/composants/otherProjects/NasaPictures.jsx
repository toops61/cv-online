import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Loader from "../../components/Loader";
import { updateGeneralParams } from "../../redux";
import { useQuery } from "react-query";

export default function NasaPictures() {
  document.querySelector('.button-container')?.classList.add('hide');

  const [input, setInput] = useState('juno europa');
  const [searchSubmit, setSearchSubmit] = useState('juno europa');
  const [selectedImage, setSelectedImage] = useState('');
  //const [title, setTitle] = useState('JunoCam Image of Europa From Flyby');
  const [moreInfos, setMoreInfos] = useState(false);

  const dispatch = useDispatch();

  const formRef = useRef();

  //fetch function
  const inputSearchQuery = async ({ queryKey }) => {
    const search = queryKey[0];
    const result = await fetch(`https://images-api.nasa.gov/search?q=${search}`);
    return result.json();
  }
  //fetch function
  const metadataQuery = async ({ queryKey }) => {
    const searchURL = queryKey[0];
    const result = await fetch(searchURL);
    return result.json();
  }

  const handleDataCollection = result => {
    const items = result?.collection && result?.collection.items ? result?.collection.items : [];
    return items;
  }

  //get json from search query
  const { data:searchResult,isLoading:loadingSearch,error:errorSearch,refetch:refetchSearch } = useQuery(
    [searchSubmit],
    inputSearchQuery,
    {
      enabled: false,
      select: data => handleDataCollection(data),
      cacheTime: 1800000
    }
  )

  //back to window top
  const backToTop = () => {
    URL && window.scrollTo({
      top: formRef?.current.offsetTop,
      behavior: 'smooth'
    });
  }

  const handleMetadata = newJson => {
    const array = Object.values(newJson);
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
    return URL ? URL : '';
  }

  //get image URL to be displayed
  const { data:imageUrlResult,isLoading:loadingMetadata,error:errorMetadata,refetch:refetchMetadata } = useQuery(
    [selectedImage.selectUrl],
    metadataQuery,
    {
      enabled: false,
      select: data => handleMetadata(data),
      cacheTime: 1800000
    }
  )

  const searchImage = e => {
    e.preventDefault();
    setSearchSubmit(e.target[0].value);
  }

  useEffect(() => {
    dispatch(updateGeneralParams({darkMode:true}));
}, []);

  useEffect(() => {
    searchSubmit && refetchSearch();
  }, [searchSubmit]);

  useEffect(() => {
    selectedImage?.selectUrl && refetchMetadata();
  }, [selectedImage]);
  

  return (
    <div className="nasa-page">
        <main className="nasa-main">
            {loadingSearch || loadingMetadata ? <Loader /> : <></>}
            <form ref={formRef} onSubmit={searchImage}>
                <label htmlFor="search-image">rechercher une image</label>
                <input type="text" name="search-image" id="search-image" onChange={e => setInput(e.target.value)} value={input} />
                <button className="valid-search"></button>
            </form>
            <div className="results-image">
                {searchResult ? <div className="results-list">
                    <h3>{searchResult.length ? 'Résultats' : 'Pas de résultat pour votre requête'}</h3>
                    {searchResult.map((item,index) => {
                        return (
                            <p 
                            key={uuidv4()} 
                            onClick={() => {
                              setSelectedImage({
                                selectUrl:item.href,
                                id:index
                              });
                              backToTop();
                            }}
                            className="result">
                                {index} {item.data[0].title}
                            </p>
                        )
                    })}
                </div> : <></>}
                <div className="picture-imported">
                    {imageUrlResult && (imageUrlResult.includes('mp4') || imageUrlResult.includes('webm')) ? 
                    <video controls>
                        <source src={imageUrlResult} type="video/webm" />
                        <source src={imageUrlResult} type="video/mp4" />
                    </video> : 
                    <img src={imageUrlResult ? imageUrlResult : 'http://images-assets.nasa.gov/image/PIA25334/PIA25334~small.jpg'} alt="Nasa" />}
                    {searchResult?.length ? <div className="legend">
                      <h4>{searchResult[selectedImage.id]?.data[0].title}</h4>
                      <p>{searchResult[selectedImage.id]?.data[0][moreInfos ? 'description' : 'description_508']}</p>
                      <p className="more-infos" onClick={() => setMoreInfos(!moreInfos)}>{!moreInfos ? 'plus d\'infos' : 'réduire'}</p>
                    </div> : <h4>JunoCam Image of Europa From Flyby</h4>}
                </div>
            </div>
        </main>
        <Link to="/Projects">
            <button className="previous-page"></button>
        </Link>
    </div>
  )
}
