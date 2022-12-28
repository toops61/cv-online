import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Calculator() {
  document.querySelector('.button-container')?.classList.remove('hide');

  const [number, setNumber] = useState('0');
  const [operation, setOperation] = useState('');
  const [operationArray, setOperationArray] = useState([]);
  const [colorsObject, setColorsObject] = useState({
    'body-color':'rgb(48, 48, 48)',
    'touch-color':'rgb(48, 48, 48)',
    'lasttouch-color':'rgb(243, 178, 39)'
  });

  useEffect(() => {
    let tempOperation = '';
    const newArray = [...operationArray];
    newArray.map(el => tempOperation += el);
    setOperation(tempOperation);
  }, [operationArray])
  

  const correctTouch = () => {
    const tempArray = [...operationArray];
    if (number !== '0') {
        setNumber(number.length === 1 ? '0' : number.slice(0,(number.length-1)));
    } else if (tempArray.length && number === '0') {
        tempArray.pop();
        tempArray.length && tempArray[tempArray.length-1]/1 && setNumber(tempArray[tempArray.length - 1]);
        tempArray.pop();
        setOperationArray([...tempArray]);
      }
  }

  //first do * and / operations
const multDivFirst = array => {
  array.map((e,index) => {
      if (e === 'x') {
          const multiplication = array[index-1]*array[index+1];
          array.splice([index-1],3,multiplication);
      }
      if (e === '/') {
          if (array[index+1] == '0') {
            setNumber('Erreur');
            setTimeout(() => {
              setNumber('0');
            }, 2000);
            array = [];
          } else {
            let division = array[index-1]/array[index+1];
            !Number.isInteger(division) && (division = division.toFixed(6));
            array.splice([index-1],3,division);
          }
      }
  })
  return array;
}

const getResult = () => {
  let tempArray = [...operationArray];
  tempArray.push(number);
  //execute * and / if it still is some
  do {
      tempArray = multDivFirst(tempArray);
  } while (tempArray.some(e => (e === '*' || e === '/')));
  if (tempArray.length) {
    let result = tempArray[0]/1;
    tempArray.length > 1 && tempArray.map((el,index) => {
      if (index > 0 && index/1) {
        switch (tempArray[index - 1]) {
            case '+':
                result += (el/1);
                break;
            case '-':
                result -= el;
                break;
            default:
              break;
        }
      }
      return result
    })
    setNumber('='+result);
  }
  setOperationArray([...tempArray]);
}

  const handleTouch = e => {
    const touchContent = e.target.textContent;
    const isNumber = !isNaN(touchContent/1) ? true : false;
    let tempArray = [...operationArray];
    if (isNumber) {
      number.includes('=') ? setNumber(touchContent) : setNumber((number === '0' ? '' : number) + touchContent);
      number.includes('=') && setOperationArray([]);
    }  else if (touchContent === '.' && !number.includes('.')) {
      setNumber(number + (number !== '0' ? touchContent : '0.'));
    }  else if (touchContent === 'CE' && (number.length || operationArray.length)) {
      if (!number.includes('=')) {
        correctTouch();
      } else {
        setNumber('0');
        setOperation('');
        tempArray.length = 0;
        setOperationArray([]);
      }
    } else if (touchContent === 'C') {
      setNumber('0');
      setOperation('');
      tempArray.length = 0;
      setOperationArray([]);
    } else if (touchContent === '=') {
      !number.includes('=') && getResult();
    } else {
      if (number === '0') {
        tempArray.pop();
        tempArray.push(touchContent);
      } else {
        number.includes('=') ? tempArray = [number.split('=')[1]] : tempArray.push(number);
        tempArray.push(touchContent);
        setNumber('0');
      }
      setOperationArray([...tempArray]);
    }
  }

  const handleColor = e => {
    const tempObjectColor = {...colorsObject};
    tempObjectColor[e.target.id] = e.target.value;
    setColorsObject({...tempObjectColor});
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
          <p className="operation">{operation}</p>
          <h1>{number}</h1>
        </header>
        <section className="calculator-touch">
          <div className="line">
            <div className="touch-background double" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>C</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>CE</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>+</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>7</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>8</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>9</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>-</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>4</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>5</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>6</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>x</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>1</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>2</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>3</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>/</p></div>
            </div>
          </div>
          <div className="line">
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>0</p></div>
            </div>
            <div className="touch-background" style={{backgroundColor:colorsObject['touch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['touch-color'])}}>.</p></div>
            </div>
            <div className="touch-background double" style={{backgroundColor:colorsObject['lasttouch-color']}}>
              <div className="touch" onClick={handleTouch}><p style={{color:textColor(colorsObject['lasttouch-color'])}}>=</p></div>
            </div>
          </div>
        </section>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
