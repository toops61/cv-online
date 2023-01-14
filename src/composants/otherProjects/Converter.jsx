import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Converter() {
    const arrayTemperatures = ['Celsius','Fahrenheit','Kelvin'];
    const arrayMasses = ['Picogramme','Nanogramme','Microgramme','Milligramme','Gramme','Kilogramme','Tonne','Once','Livre','Stone'];
    const arrayDimensions = ['Picomètre','Nanomètre','Micromètre','Millimètre','Centimètre','Décimètre','Mètre','Décamètre','Hectomètre','Kilomètre','Once','Livre','Stone'];

    const [arraySelected, setArraySelected] = useState([...arrayTemperatures]);
    const [type, setType] = useState('temperature');
    const [selectedFrom, setSelectedFrom] = useState(arraySelected[0]);
    const [inputFrom, setInputFrom] = useState('');
    const [selectedTo, setSelectedTo] = useState(arraySelected[1]);
    const [inputTo, setInputTo] = useState('');

    const resetInputs = () => {
        setInputFrom(0);
        setInputTo(0);
    }

    const selectType = e => {
        switch (e.target.value) {
            case 'temperature':
                setArraySelected([...arrayTemperatures]);
                setType('temperature');
                break;
            case 'masse':
                setArraySelected([...arrayMasses]);
                setType('masse');
                break;
            case 'dimensions':
                setArraySelected([...arrayDimensions]);
                setType('dimensions');
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        resetInputs();
        setSelectedFrom(arraySelected[0]);
        setSelectedTo(arraySelected[1]);
    }, [arraySelected])
    
    const convertTemperature = () => {
        console.log('convert temperature');
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

    const convertMasse = () => {
        console.log('convert masse');
    }

    const convertDimensions = () => {
        console.log('convert dimensions');
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
        
        if (selectedFrom === selectedTo) {
            result = value;
        } else {
            switch (type) {
                case 'temperature':
                    convertTemperature();
                    break;
                case 'masse':
                    result = tempObject.index <= 9 ? picoKilo({...tempObject,input:picoKilo(tempObject,'toX')},'fromX') : convertMasse();
                    break;
                case 'dimensions':
                    result = tempObject.index <= 9 ? picoKilo({...tempObject,input:picoKilo(tempObject,'toX')},'fromX') : convertDimensions();
                    break;
                default:
                    break;
            }
        }

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
        id === 'from' ? convertFunct('before',inputFrom) : convertFunct('after',inputTo);
    }

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
