import { useState } from "react"

export default function Calculator() {
  const [number, setNumber] = useState('');
  const [operation, setOperation] = useState('');
  const [operationArray, setOperationArray] = useState([]);
  const [colorsObject, setColorsObject] = useState({
    'body-color':'rgb(48, 48, 48)',
    'touch-color':'rgb(48, 48, 48)',
    'lasttouch-color':'rgb(243, 178, 39)'
  });

  const handleColor = e => {
    const tempObjectColor = {...colorsObject};
    tempObjectColor[e.target.id] = e.target.value;
    setColorsObject({...tempObjectColor});
  }

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
    const newColor = yiq > 128 ? "#000" : "#fff";
    return newColor;
  }

  const textColor = color => {
    if (color.includes('#')) {
      const shorthandRegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      color = color.replace(shorthandRegExp, function(r, g, b) {
        return r + r + g + g + b + b;
      });
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      const yiq = (r*299 + g*587 + b*144) / 1000;
      const newColor = yiq > 128 ? "#000" : "#fff";
      return newColor;
    } else {
      const rgb = color.split('(')[1].split(')')[0];
      const [r,g,b] = rgb.split(',');
      const yiq = (r*299 + g*587 + b*144) / 1000;
      const textNewColor = `rgb(${yiq > 128 ? '0,0,0' : '255,255,255'})`;
      return textNewColor;
    }
  }

  return (
    <div className="calculator-page">
      <form>
        <div className="color-container">
          <label htmlFor="body-color">changez la couleur de la calculatrice</label>
          <input type="color" name="body-color" id="body-color" defaultValue="#303030" onChange={handleColor} />
        </div>
        <div className="color-container">
          <label htmlFor="touch-color">changez la couleur des touches</label>
          <input type="color" name="touch-color" id="touch-color" defaultValue="#303030" onChange={handleColor} />
        </div>
        <div className="color-container">
          <label htmlFor="lasttouch-color">...et la dernière</label>
          <input type="color" name="lasttouch-color" id="lasttouch-color" defaultValue="#ffbc2b" onChange={handleColor} />
        </div>
      </form>
      <main className="calculator-body" style={{backgroundColor:colorsObject['body-color']}}>
        <header className="calculator-screen">
          <p className="operation"></p>
          <h1>0</h1>
        </header>
        <section className="calculator-touch">
          <div className="line">
            <div className="touch-background double" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch"><p style={{color:textColor(colorsObject['touch-color'])}}>C</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch"><p style={{color:textColor(colorsObject['touch-color'])}}>CE</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch operator"><p style={{color:textColor(colorsObject['touch-color'])}}>+</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>7</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>8</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>9</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch operator"><p style={{color:textColor(colorsObject['touch-color'])}}>-</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>4</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>5</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>6</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch operator"><p style={{color:textColor(colorsObject['touch-color'])}}>x</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>1</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>2</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>3</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch operator"><p style={{color:textColor(colorsObject['touch-color'])}}>/</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch digits"><p style={{color:textColor(colorsObject['touch-color'])}}>0</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch"><p style={{color:textColor(colorsObject['touch-color'])}}>.</p></div>
            </div>
            <div className="touch-background double" style={{backgroundColor:colorsObject['lasttouch-color']}}>
              <div className="touch"><p style={{color:textColor(colorsObject['lasttouch-color'])}}>=</p></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
