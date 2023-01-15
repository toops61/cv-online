import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Converter() {
    const arrayTemperatures = ['Celsius','Fahrenheit','Kelvin'];
    const arrayMasses = ['Picogramme','Nanogramme','Microgramme','Milligramme','Gramme','Kilogramme','Tonne','Once','Livre','Stone'];
    const arrayDimensions = ['Picomètre','Nanomètre','Micromètre','Millimètre','Centimètre','Décimètre','Mètre','Décamètre','Hectomètre','Kilomètre','Pouce','Pied','Yard','Mile','Mile marin','Année lumière'];

    const [arraySelected, setArraySelected] = useState([...arrayTemperatures]);
    const [type, setType] = useState('temperature');
    const [selectedFrom, setSelectedFrom] = useState(arraySelected[0]);
    const [inputFrom, setInputFrom] = useState(0);
    const [selectedTo, setSelectedTo] = useState(arraySelected[1]);
    const [inputTo, setInputTo] = useState(32);

    const resetInputs = () => {
        setInputFrom(0);
        setInputTo(0);
    }

    const selectType = e => {
        switch (e.target.value) {
            case 'temperature':
                setArraySelected([...arrayTemperatures]);
                setType('temperature');
                setInputFrom(0);
                setInputTo(32);
                break;
            case 'masse':
                setArraySelected([...arrayMasses]);
                setType('masse');
                resetInputs();
                break;
            case 'dimensions':
                setArraySelected([...arrayDimensions]);
                setType('dimensions');
                resetInputs();
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        setSelectedFrom(arraySelected[0]);
        setSelectedTo(arraySelected[1]);
    }, [arraySelected])

    const limitTemperature = (tempMin,id) => {
        const valueNumber = tempMin;
        id === 'before' ? setInputFrom(tempMin) : setInputTo(tempMin);
        return valueNumber;
    }
    
    const convertTemperature = (id,value) => {
        let valueNumber = value/1;
        let result = 0;
        const first = id === 'before' ? selectedFrom : selectedTo;
        const second = id === 'before' ? selectedTo : selectedFrom;
        switch (first) {
            case 'Celsius':
                valueNumber < (-273.15) && (valueNumber = limitTemperature(-273.15,id));
                result = second === 'Fahrenheit' ? ((valueNumber * 9 / 5) + 32) : (valueNumber + 273.15);
                first === second && (result = valueNumber);
                break;
            case 'Fahrenheit':
                valueNumber < (-459.66) && (valueNumber = limitTemperature(-459.66,id));
                result = ((valueNumber - 32) * 5 / 9) + (second === 'Celsius' ? 0 : 273.15);
                first === second && (result = valueNumber);
                break;
            case 'Kelvin':
                valueNumber < 0 && (valueNumber = limitTemperature(0,id));
                const celsius = valueNumber - 273.15;
                result = second === 'Fahrenheit' ? ((celsius * 9 / 5) + 32) : celsius;
                first === second && (result = valueNumber);
                break;
            default:
                break;
        }
        return result;
    }

    const picoKilo = (object,direction) => {
        const index = direction === 'toX' ? object.index : object.target_index;
        if (index <= 3) {
            const indice = direction === 'toX' ? (index - 4) : (4 - index);
            const result = object.input * (10**(3*indice));
            return result;
        } else {
            const indice = direction === 'toX' ? (index - 6) : (6 - index);
            const result = object.input * (10**indice);
            return result;
        }
    }

    const convertDimensions = (object,direction) => {
        const index = direction === 'toX' ? object.index : object.target_index;
        let result = 0;
        switch (index) {
            case 10:
                result = direction === 'toX' ? (object.input / 39.37) : (object.input * 39.37);
                break;
            case 11:
                result = direction === 'toX' ? (object.input / 3.281) : (object.input * 3.281);
                break;
            case 12:
                result = direction === 'toX' ? (object.input / 1.094) : (object.input * 1.094);
                break;
            case 13:
                result = direction === 'toX' ? (object.input * 1609) : (object.input / 1609);
                break;
            case 14:
                result = direction === 'toX' ? (object.input * 1852) : (object.input / 1852);
                break;
            case 15:
                result = direction === 'toX' ? (object.input * 9.4608e15) : (object.input / 9.4608e15);
                break;
            default:
                break;
        }
        return result;
    }

    const convertMasse = () => {
        console.log('convert masse');
    }

    const convertFunct = (id,value) => {
        let result = 0;
        const tempObject = id === 'before' ? {
            index: arraySelected.indexOf(selectedFrom),
            target_index:arraySelected.indexOf(selectedTo),
            input: value
        } : {
            index: arraySelected.indexOf(selectedTo),
            target_index:arraySelected.indexOf(selectedFrom),
            input: value
        }
        
        if (selectedFrom === selectedTo && type !== 'temperature') {
            result = value;
        } else {
            switch (type) {
                case 'temperature':
                    result = convertTemperature(id,value);
                    break;
                case 'masse':
                    const masse = tempObject.index <= 9 ? picoKilo(tempObject,'toX') : convertMasse(tempObject,'toX');
                    result = tempObject.target_index <= 9 ? picoKilo({...tempObject,input:masse},'fromX') : convertMasse({...tempObject,input:masse},'fromX');
                    break;
                case 'dimensions':
                    const meters = tempObject.index <= 9 ? picoKilo(tempObject,'toX') : convertDimensions(tempObject,'toX');
                    result = tempObject.target_index <= 9 ? picoKilo({...tempObject,input:meters},'fromX') : convertDimensions({...tempObject,input:meters},'fromX');
                    break;
                default:
                    break;
            }
        }
        result > 1e6 && (result = result.toExponential());
        id === 'before' ? setInputTo(result) : setInputFrom(result);
    }

    const handleInput = e => {
        const id = e.target.id;
        const value = e.target.value;
        id === 'before' ? setInputFrom(value) : setInputTo(value);
        convertFunct(id,value);
    }

    const changeUnities = e => {
        const id = e.target.id;
        id === 'from' ? setSelectedFrom(e.target.value) : setSelectedTo(e.target.value);
    }

    useEffect(() => {
      convertFunct('before',inputFrom);
    }, [selectedFrom,selectedTo])

    
  return (
    <div className="converter-page">
        <main className="converter-main">
            <h1>Convertisseurs</h1>
            <select name="type" id="type" onChange={selectType}>
                <option value="temperature">Température</option>
                <option value="masse">Masses</option>
                <option value="dimensions">Longueurs</option>
            </select>
            <section className="containers">
                <div className="container">
                    <label htmlFor="before">{selectedFrom}</label>
                    <input type="number" name="before" id="before" onChange={handleInput} value={inputFrom} placeholder='0' />
                    <select name="from" id="from" onChange={changeUnities} value={selectedFrom}>
                      {arraySelected.map(el => {
                        return (
                            <option value={el} key={uuidv4()}>{el}</option>
                        )
                      })}  
                    </select>
                </div>
                <div className="convert-arrow"></div>
                <div className="container">
                    <label htmlFor="after">{selectedTo}</label>
                    <input type="number" name="after" id="after"  onChange={handleInput} value={inputTo} placeholder='0' />
                    <select name="to" id="to" onChange={changeUnities} value={selectedTo}>
                    {arraySelected.map(el => {
                        return (
                            <option value={el} key={uuidv4()}>{el}</option>
                        )
                      })}
                    </select>
                </div>
            </section>

        </main>
        <Link to="/Projects">
            <button className="previous-page"></button>
        </Link>
    </div>
  )
}
