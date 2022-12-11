import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Slider() {
  document.querySelector('.button-container')?.classList.remove('hide');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [imagesArray, setImagesArray] = useState(false);
  const [centerIndex, setCenterIndex] = useState(1);

  const displayAlert = text => {
    setAlertText(text);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
  }

  const getImages = async () => {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=3');
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        };
        const data = await response.json();
        const array = [];
        for (let i = 0; i < 3; i++) {
          array.push(data[i]);
        }
        setImagesArray([...array]);
    } catch (error) {
        console.log(error);
        displayAlert('Nous n\'avons pas pu récupérer les photos, réessayez.');
    }
  }

  useEffect(() => {
    getImages();
  }, [])

  const toTheLeft = () => {
    document.querySelector('.top-section').classList.add('left-anim');
    setTimeout(() => {
      setCenterIndex(centerIndex > 2 ? 1 : (centerIndex+1));
    }, 800);
  }

  const toTheRight = () => {
    document.querySelector('.top-section').classList.add('right-anim');
    setTimeout(() => {
      setCenterIndex(centerIndex > 1 ? (centerIndex-1) : 3);
    }, 800);
  }

  const PictureSection = () => {
    const [picturesObjectsArray, setPicturesObjectsArray] = useState([]);

    const fillImages = () => {
      const tempObjects = [];
      let order = [];
      switch (centerIndex) {
        case 1:
          order = [2,0,1];
          break;
        case 2:
          order = [0,1,2];
          break;
        case 3:
          order = [1,2,0];
          break;
      }
      order.map(el => tempObjects.push({name:imagesArray[el].id,url:imagesArray[el].url}));
      setPicturesObjectsArray([...tempObjects]);
    }

    useEffect(() => {
      imagesArray.length && fillImages();
    }, [centerIndex])

    return (
    <section className="top-section">
      {picturesObjectsArray.length && <>
        <div className="picture-container">
          <div className="picture-box">
            <img src={picturesObjectsArray[0].url} alt="cat" />
          </div>
          <h3>slide{centerIndex > 1 ? centerIndex-1 : 3}</h3>
          <p>{picturesObjectsArray[0].name}</p>
        </div>
        <div className="picture-container visible">
          <div className="picture-box">
            <img src={picturesObjectsArray[1].url} alt="cat" />
          </div>
          <h3>slide{centerIndex}</h3>
          <p>{picturesObjectsArray[1].name}</p>
        </div>
        <div className="picture-container">
          <div className="picture-box">
          <img src={picturesObjectsArray[2].url} alt="cat" />              
          </div>
          <h3>slide{centerIndex < 3 ? centerIndex+1 : 1}</h3>
          <p>{picturesObjectsArray[2].name}</p>
        </div>
      </>}
    </section>)
  }

  return (
    <div className="slider-page">
      {alertVisible && <div className="alert-window">
        <div className="alert-box">
          <h1>{alertText}</h1>
        </div>
      </div>}
      <main className="main-slider">
        <button className="arrow left" onClick={toTheLeft}></button>
        <button className="arrow right" onClick={toTheRight}></button>
        {imagesArray.length && <PictureSection />}
        <button className="button-change" onClick={getImages}>Changer d'image</button>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
