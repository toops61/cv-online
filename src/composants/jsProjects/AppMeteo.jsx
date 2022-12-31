import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Loader from "../../components/Loader";

export default function AppMeteo() {
  document.querySelector('.button-container')?.classList.add('hide');
  
  const [showLoader, setShowLoader] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [jsonResult, setJsonResult] = useState();
  const [positionActual, setPositionActual] = useState(true)
  const [jsonCoordinates, setJsonCoordinates] = useState();
  const [night, setNight] = useState(false);
  const [infoToDisplay, setInfoToDisplay] = useState({
    temp:'',
    icon:'',
    imageURL:'',
    timezone:'',
    arrayHours:[],
    arrayDays:[]
  })
  const [meteoDisplayed, setMeteoDisplayed] = useState('hours');

  //call meteo API
  const meteoCall = async () => {
    setShowLoader(true);
    console.log('CALL API');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${jsonCoordinates.latitude}&lon=${jsonCoordinates.longitude}&exclude=minutely&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const json = await response.json();
      sessionStorage.setItem("apiResult", JSON.stringify(json));
      setJsonResult({...json});
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error(error);
    }
  };

  const convertDt = dateTime => new Date(dateTime * 1000).getHours() + "h";

  const fillHoursTemp = () => {
    const arrayTemp = [];
    for (let i = 1; i < 8; i++) {
        arrayTemp.push({
            hour: convertDt(jsonResult.hourly[i*3].dt),
            temperature: Math.round(jsonResult.hourly[i*3].temp - 273.15) + '°'
        })
    }
    return arrayTemp;
}

  const fillDaysTemp = () => {
    const arrayTemp = [];
    const arrayDays = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    for (let i = 1; i < 8; i++) {
        const day = new Date(jsonResult.daily[i].dt*1000).getDay();
        arrayTemp.push({
            day: arrayDays[day],
            temperature: Math.round(jsonResult.daily[i].temp.day - 273.15) + '°'
        })
    }
    return arrayTemp;
  }

  const fillInfos = () => {
    const tempObject = {...infoToDisplay};
    tempObject.icon =  jsonResult.current.weather[0].icon;
    setNight(tempObject.icon.includes('n') ? true : false);
    tempObject.imageURL = `./ressourcesMeteo/${tempObject.icon.includes('d') ? 'jour' : 'nuit'}/${tempObject.icon}.svg`;
    tempObject.temp = Math.round(jsonResult.current.temp - 273.15) + '°';
    tempObject.arrayHours = fillHoursTemp();
    tempObject.arrayDays = fillDaysTemp();
    tempObject.timezone = jsonResult.timezone;
    setInfoToDisplay({...tempObject});
  }

  useEffect(() => {
    jsonResult && fillInfos();
  }, [jsonResult])

  const saveCoordinates = (latitude,longitude) => {
    const lat = Math.round(latitude * 10000) / 10000;
    const lon = Math.round(longitude * 10000) / 10000;
    const tempObject = {
      latitude:lat,
      longitude:lon
    }
    setJsonCoordinates({...tempObject});
  }

  const getCoordinates = () => {
    try {navigator.geolocation.getCurrentPosition(position => {
      saveCoordinates(position.coords.latitude,position.coords.longitude);
    })} catch (error) {
      console.log(error);
      //"On ne peut vous donner la météo sans votre localisation. Autorisez la svp."
    }
  }
  
  //get location coordinates
  useEffect(() => {
    localStorage.meteoApiKey && setApiKey(JSON.parse(localStorage.getItem("meteoApiKey")));
  }, []);
  
  useEffect(() => {
    positionActual && getCoordinates();
  }, [positionActual])
  

  useEffect(() => {
    let result = '';
    sessionStorage.apiResult && (result = JSON.parse(sessionStorage.getItem("apiResult")));
    if(apiKey && jsonCoordinates) {
      if (result && (new Date(result.current.dt*1000).getDate() === new Date().getDate()) && (new Date(result.current.dt*1000).getHours() === new Date().getHours()) && (result.lat == jsonCoordinates.latitude) && (result.lon == jsonCoordinates.longitude)) {
        setJsonResult({...result});
      } else {
        meteoCall();
      }
    }
  }, [apiKey,jsonCoordinates]);

  const validateKey = () => {
    apiKey && localStorage.setItem("meteoApiKey", JSON.stringify(apiKey));
  };

  const handleKey = e => setApiKey(e.target.value);

  const HoursDisplayed = () => {
    return (
      infoToDisplay.arrayHours.map(el => {
        return (
          <div className="temp-container" key={uuidv4()}>
            <h4>{el.hour}</h4>
            <p>{el.temperature}</p>
          </div>
        )
      })
    )
  }

  const DaysDisplayed = () => {
    return (
      infoToDisplay.arrayDays.map(el => {
        return (
          <div className="temp-container" key={uuidv4()}>
            <h4>{el.day}</h4>
            <p>{el.temperature}</p>
          </div>
        )
      })
    )
  }

  const handlePositionChoice = e => {
    e.target.id === 'actual' ? setPositionActual(true) : setPositionActual(false);
  }

  const submitNewCoord = e => {
    e.preventDefault();
    saveCoordinates(e.target[0].value,e.target[1].value);
  }

  return (
    <div className="meteo-page">
      <main className={night ? "main-container night" : "main-container"}>
        <div className="meteo-container">
          {showLoader && <Loader />}
          <section className="up-part">
            <h1>
              <span>Application</span> météo
            </h1>
            <div className="logo">
              <img src={infoToDisplay.imageURL} alt="icon" />
            </div>
            <h2 className="temp">{infoToDisplay.temp}</h2>
            <p className="place">{infoToDisplay.timezone}</p>
          </section>
          <section className="down-part">
            <div className="tabs-section">
              <button className="hours-button" onClick={e => setMeteoDisplayed('hours')}>
                <p>Heures</p>
              </button>
              <button className="days-button" onClick={e => setMeteoDisplayed('days')}>
                <p>Prévisions</p>
              </button>
            </div>
            <div className="display-part">
              {meteoDisplayed === 'hours' ? <HoursDisplayed /> : <DaysDisplayed />}
            </div>
          </section>
        </div>
        <div className="inputs-container">
            <div className="position-container">
              <div className="input-container">
                <input type="radio" name="position-choice" id="actual" defaultChecked="true" onChange={handlePositionChoice} />
                <label htmlFor="position-choice">Utiliser votre position actuelle</label>
              </div>
              <div className="input-container">
                <input type="radio" name="position-choice" id="chosen" onChange={handlePositionChoice} />
                <label htmlFor="position-choice">Choisir une autre position</label>
              </div>
                {!positionActual && <form onSubmit={submitNewCoord} className="position-fields">
                  <div className="coordinates-container">
                    <label htmlFor="chosen-latitude">Latitude</label>
                    <input type="number" name="chosen-latitude" id="chosen-latitude" />
                  </div>
                  <div className="coordinates-container">
                    <label htmlFor="chosen-latitude">Longitude</label>
                    <input type="number" name="chosen-latitude" id="chosen-longitude" />
                  </div>
                  <button type="submit"></button>
                </form>}
            </div>
          <div className="apikey-container">
            <input
              type="password"
              name="api-key"
              id="api-key"
              onChange={handleKey}
              value={apiKey}
            />
            <button onClick={validateKey} className="validate-api"></button>
            <label htmlFor="api-key">
              {apiKey ? (
                <p>Changez votre clé d'API ?</p>
              ) : (
                <p>
                  Entrez votre clé d'API, récupérée{" "}
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ici
                  </a>
                </p>
              )}
            </label>
          </div>
        </div>
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  );
}
