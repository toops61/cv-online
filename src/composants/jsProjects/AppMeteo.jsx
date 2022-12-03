import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function AppMeteo() {
  const [showLoader, setShowLoader] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [jsonResult, setJsonResult] = useState();
  const [positionActual, setPositionActual] = useState(true)
  const [jsonCoordonates, setJsonCoordonates] = useState();
  const [timezone, setTimezone] = useState();
  const [night, setNight] = useState(false);
  const [infoToDisplay, setInfoToDisplay] = useState({
    temp:'',
    icon:'',
    imageURL:'',
    arrayHours:[],
    arrayDays:[]
  })
  const [meteoDisplayed, setMeteoDisplayed] = useState('hours');

  const fillLocation = () => setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

  //call meteo API
  const meteoCall = async () => {
    setShowLoader(true);
    console.log('CALL API');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${jsonCoordonates.latitude}&lon=${jsonCoordonates.longitude}&exclude=minutely&appid=${apiKey}`
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
    !tempObject.icon.includes('d') && setNight(true);
    tempObject.imageURL = `./ressourcesMeteo/${tempObject.icon.includes('d') ? 'jour' : 'nuit'}/${tempObject.icon}.svg`;
    tempObject.temp = Math.round(jsonResult.current.temp - 273.15) + '°';
    tempObject.arrayHours = fillHoursTemp();
    tempObject.arrayDays = fillDaysTemp();
    setInfoToDisplay({...tempObject});
  }

  useEffect(() => {
    jsonResult && fillInfos();
  }, [jsonResult])
  
  //get location coordonates
  useEffect(() => {
    try {navigator.geolocation.getCurrentPosition(position => {
      const lat = Math.round(position.coords.latitude * 10000) / 10000;
      const lon = Math.round(position.coords.longitude * 10000) / 10000;
      const tempObject = {
        latitude:lat,
        longitude:lon
      }
      setJsonCoordonates({...tempObject})
    })} catch (error) {
      console.log(error);
      //"On ne peut vous donner la météo sans votre localisation. Autorisez la svp."
    }
  }, []);

  useEffect(() => {
    localStorage.meteoApiKey && setApiKey(JSON.parse(localStorage.getItem("meteoApiKey")));
    fillLocation();
  }, [])
  

  useEffect(() => {
    let result = '';
    sessionStorage.apiResult && (result = JSON.parse(sessionStorage.getItem("apiResult")));
    if(apiKey && jsonCoordonates) {
      if (result && (new Date(result.current.dt*1000).getDate() === new Date().getDate()) && (new Date(result.current.dt*1000).getHours() === new Date().getHours()) && (result.lat == jsonCoordonates.latitude) && (result.lon == jsonCoordonates.longitude)) {
        setJsonResult({...result});
      } else {
        meteoCall();
      }
    }
  }, [apiKey,jsonCoordonates]);

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

  const submitNewCoord = () => {

  }

  return (
    <div className="meteo-page">
      <main className={night ? "main-container night" : "main-container"}>
        <div className="meteo-container">
          {showLoader && (
            <div className="loader">
              <div className="point"></div>
              <div className="point"></div>
              <div className="point"></div>
            </div>
          )}
          <section className="up-part">
            <h1>
              <span>Application</span> météo
            </h1>
            <div className="logo">
              <img src={infoToDisplay.imageURL} alt="icon" />
            </div>
            <h2 className="temp">{infoToDisplay.temp}</h2>
            <p className="place">{timezone}</p>
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
                {!positionActual && <div className="position-fields">
                  <label htmlFor="chosen-latitude">Latitude</label>
                  <input type="number" name="chosen-latitude" id="chosen-latitude" />
                  <label htmlFor="chosen-latitude">Longitude</label>
                  <input type="number" name="chosen-latitude" id="chosen-longitude" />
                  <button onClick={submitNewCoord}></button>
                </div>}
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
    </div>
  );
}
