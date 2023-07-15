import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Loader from "../../components/Loader";
import { useQuery } from "react-query";

export default function AppMeteo() {
  document.querySelector('.button-container')?.classList.add('hide');
  
  const [apiKey, setApiKey] = useState('');
  const [jsonResult, setJsonResult] = useState('');
  const [positionActual, setPositionActual] = useState(true);
  const [jsonCoordinates, setJsonCoordinates] = useState('');
  const [night, setNight] = useState(false);
  const [callData, setCallData] = useState(false);
  const [infoToDisplay, setInfoToDisplay] = useState({
    temp:'',
    icon:'',
    imageURL:'',
    timezone:'',
    arrayHours:[],
    arrayDays:[]
  })
  const [extraInfos, setExtraInfos] = useState({
    sun_up:'',
    sun_down:'',
    temp_feel:'',
    humidity:'',
    wind_speed:''
  })
  const [meteoDisplayed, setMeteoDisplayed] = useState('hours');
  const [moreInfos, setMoreInfos] = useState(false);

  //fetch function
  const inputSearchQuery = async () => {
    const url = apiKey ? `https://api.openweathermap.org/data/3.0/onecall?lat=${jsonCoordinates.latitude}&lon=${jsonCoordinates.longitude}&exclude=minutely&appid=${apiKey}` : '';
    const response = await fetch(url);
    try {
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const handleData = result => {
    if (JSON.stringify(jsonResult) !== JSON.stringify(result) && result.current) {
      setJsonResult(result);
      sessionStorage.setItem('meteoData',JSON.stringify(result));
      setCallData(false);
    }
    return result;
  }

  //get json from search query
  const { isLoading,error } = useQuery(
    'meteo',
    inputSearchQuery,
    {
      enabled: !!callData,
      select: data => handleData(data),
      cacheTime: 1800000,
      staleTime:1800000
    }
  )

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

  const fillExtraObject = () => {
    const extraObject = {...extraInfos};
    const resultInfos = jsonResult.current;

    const sunSecondsUp = resultInfos.sunrise;
    const sunSecondsDown = resultInfos.sunset;
    const sunTimeUp = new Date(sunSecondsUp*1000).toLocaleTimeString();
    const sunTimeDown = new Date(sunSecondsDown*1000).toLocaleTimeString();
    extraObject.sun_up = sunTimeUp.substring(0,(sunTimeUp.length-3));
    extraObject.sun_down = sunTimeDown.substring(0,(sunTimeDown.length-3));

    extraObject.temp_feel = (Math.round((resultInfos.feels_like - 273.15)*10))/10;

    extraObject.humidity = resultInfos.humidity;

    extraObject.wind_speed = resultInfos.wind_speed*3.6;

    setExtraInfos(extraObject);
  }

  //get fetched data infos and fill fields
  const fillInfos = () => {
    const tempObject = {...infoToDisplay};
    const icon =  jsonResult.current.weather[0].icon;
    tempObject.imageURL =  `https://openweathermap.org/img/wn/${icon}@2x.png`;
    setNight(icon.includes('n') ? true : false);
    tempObject.temp = Math.round(jsonResult.current.temp - 273.15) + '°';
    tempObject.arrayHours = fillHoursTemp();
    tempObject.arrayDays = fillDaysTemp();
    tempObject.timezone = jsonResult.timezone;
    setInfoToDisplay({...tempObject});
    fillExtraObject();
  }

  useEffect(() => {
    jsonResult && fillInfos();
  }, [jsonResult])

  const saveCoordinates = (latitude,longitude) => {
    const lat = Math.round(latitude * 1000) / 1000;
    const lon = Math.round(longitude * 1000) / 1000;
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

  const checksOldData = () => {
    const actualDateTime = new Date().getTime();
    if (sessionStorage.meteoData) {
      const storedData = JSON.parse(sessionStorage.getItem('meteoData'));
      const storedDt = storedData.current.dt*1000;
      const difference = actualDateTime - storedDt;
      let recall = false;
      difference < 7200000 ? setJsonResult(storedData) : (recall = true);
      if (jsonCoordinates && (jsonCoordinates.latitude !== storedData.lat || jsonCoordinates.longitude !== storedData.lon)) recall = true;
      if (recall && jsonCoordinates?.longitude && apiKey) setCallData(true);
    } else {
      if (jsonCoordinates?.longitude && apiKey) setCallData(true);
    }
  }
  
  //get location coordinates
  useEffect(() => {
    localStorage.meteoApiKey && setApiKey(JSON.parse(localStorage.getItem("meteoApiKey")));
  }, []);
  
  useEffect(() => {
    checksOldData();
  }, [jsonCoordinates,apiKey])
  
  
  useEffect(() => {
    positionActual && getCoordinates();
  }, [positionActual])
  
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
    
    const newLat = Math.round(e.target[0].value * 1000) / 1000;
    const newLon = Math.round(e.target[1].value * 1000) / 1000;

    saveCoordinates(newLat,newLon);
  }

  return (
    <div className="meteo-page">
      <main className={night ? "main-container night" : "main-container"}>
        <div className={"meteo-container" + (moreInfos ? " more" : "")}>
          {isLoading ? <Loader /> : <></>}
          <section className="up-part">
            <button className="more-arrow" onClick={() => setMoreInfos(!moreInfos)}></button>
            <h1>
              <span>Application</span> météo
            </h1>
            <div className="logo">
              <img src={infoToDisplay.imageURL} alt="icon" />
            </div>
            <h2 className="temp">{infoToDisplay.temp}</h2>
            <p className="place">{infoToDisplay.timezone}</p>
          </section>
          <section className="more-infos-part">
            <h4>Soleil</h4>
            <p><span>Lever : </span>{extraInfos.sun_up}</p>
            <p><span>Coucher : </span>{extraInfos.sun_down}</p>
            <p className="category"><span>Temp. ressentie : </span>{extraInfos.temp_feel}</p>
            <p className="category"><span>Humidité : </span>{extraInfos.humidity}%</p>
            <p className="category"><span>Vent : </span>{extraInfos.wind_speed} km/h</p>
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
                {!positionActual ? <form onSubmit={submitNewCoord} className="position-fields">
                  <div className="coordinates-container">
                    <label htmlFor="chosen-latitude">Latitude</label>
                    <input type="number" name="chosen-latitude" id="chosen-latitude" />
                  </div>
                  <div className="coordinates-container">
                    <label htmlFor="chosen-latitude">Longitude</label>
                    <input type="number" name="chosen-latitude" id="chosen-longitude" />
                  </div>
                  <button type="submit"></button>
                </form> : <></>}
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
