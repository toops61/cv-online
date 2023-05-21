import { useState } from "react";
import { Link } from "react-router-dom";

export default function CouleursJS() {
  document.querySelector('.button-container')?.classList.add('hide');
  
  const [alertPage, setAlertPage] = useState(false);
  const [objectColor, setObjectColor] = useState({
    orientation: 128,
    color_one: '#ba0303',
    color_two: '#ffb638'
  })
  
  const hexToRgb = hex => {
    const shorthandRegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegExp, function(r, g, b) {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const yiq = (r*299 + g*587 + b*144) / 1000;
    const textColor = yiq > 128 ? "#000" : "#fff";
    return textColor;
  }

  const componentToHex = x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
    
  const rgbToHex = (r, g, b) => {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  const randomFunc = max => Math.floor(Math.random() * max);

  const randomColor = () => {
    let [r,g,b] = ['r','g','b'].map(e => randomFunc(256));
    const tempObject = {};
    tempObject.color_one = rgbToHex(r,g,b);
    [r,g,b] = ['r','g','b'].map(e => randomFunc(256));
    tempObject.color_two = rgbToHex(r,g,b);
    tempObject.orientation = randomFunc(360);
    setObjectColor({...tempObject});
  }

  const openAlert = () => {
    setAlertPage(true);
    setTimeout(() => {
      setAlertPage(false);
    }, 2000);
  }

  const copyColors = () => {
    const text = `linear-gradient(${objectColor.orientation}deg,${objectColor.color_one}, ${objectColor.color_two})`;
    navigator.clipboard.writeText(text).then(() => openAlert(),error => console.log(error));
  } 

  const handleColor = e => {
    const tempObject = {...objectColor};
    const id = e.target.id;
    tempObject[id] = e.target.value;
    setObjectColor({...tempObject});
  }

  return (
    <div className="colors-page">
      {alertPage ? <div className="alert-window">
        <div className="alert-container">
          <h2>Couleurs copiées dans le presse-papiers</h2>
        </div>
      </div> : <></>}
      <main className="main-colors" style={{background: 'linear-gradient('+objectColor.orientation+'deg,'+objectColor.color_one+','+objectColor.color_two+')'}}>
      <div className="color-container">
            <label htmlFor="color_one" className="color-label" style={{backgroundColor:objectColor.color_one}}>
              <p style={{color:hexToRgb(objectColor.color_one)}}>{objectColor.color_one}</p>
            </label>
            <input 
              type="color" 
              name="color_one" 
              id="color_one" 
              className="input-color" 
              onChange={handleColor} 
              value={objectColor.color_one}
            />
        </div>
        <div className="color-container">
            <label htmlFor="color_two" className="color-label" style={{backgroundColor:objectColor.color_two}}>
              <p style={{color:hexToRgb(objectColor.color_two)}}>{objectColor.color_two}</p>
            </label>
            <input 
              type="color" 
              name="color_two" 
              id="color_two" 
              className="input-color" 
              onChange={handleColor} 
              value={objectColor.color_two}
            />
        </div>
        <div className="range-container">
            <label htmlFor="orientation" className="label-orientation"><h2>orientation : </h2><p>{`${objectColor.orientation}°`}</p></label>
            <input 
              type="range" 
              name="orientation" 
              id="orientation" 
              min="0" 
              max="360" 
              onChange={handleColor} 
              value={objectColor.orientation}
            />
        </div>
        <div className="buttons-container">
            <button onClick={copyColors}><p>Copier</p></button>
            <button onClick={randomColor}><p>Random</p></button>
        </div>
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
