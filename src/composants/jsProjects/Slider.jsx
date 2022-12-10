import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Slider() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [imagesArray, setImagesArray] = useState(false);

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
        setImagesArray([...data]);
        //topSection.children.length === 0 ? constructImagesContainers() : fillImages(imagesArray); 
    } catch (error) {
        console.log(error);
        displayAlert('Nous n\'avons pas pu récupérer les photos, réessayez.');
    }
  }

  useEffect(() => {
    getImages();
  }, [])
  
  const fillImages = () => {
    
  }

  return (
    <div className="slider-page">
      {alertVisible && <div className="alert-window">
        <div className="alert-box">
          <h1>{alertText}</h1>
        </div>
      </div>}
      <main className="main-slider">
        <button className="arrow left"></button>
        <button className="arrow right"></button>
        <section className="top-section">
        </section>
        <button className="button-change">Change pictures</button>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
