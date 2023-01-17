import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Converter() {
    const arrayTemperatures = ['Celsius','Fahrenheit','Kelvin'];
    const arrayTime = ['Picosecondes','Nanosecondes','Microsecondes','Millisecondes','Secondes','Minutes','Heures','Jour','Semaine','Mois','Année','Décennie','Siècle','Millénaire'];
    const arrayMasses = ['Picogrammes','Nanogrammes','Microgrammes','Milligrammes','Centigrammes','Décigrammes','Grammes','Décagrammes','Hectogrammes','Kilogrammes','Onces','Livres','Stones','Tonnes'];
    const arrayDimensions = ['Picomètres','Nanomètres','Micromètres','Millimètres','Centimètres','Décimètres','Mètres','Décamètres','Hectomètres','Kilomètres','Pouces','Pieds','Yards','Miles','Miles marins','Années-lumière'];
    const arrayAreas = ['Picomètres carrés','Nanomètres carrés','Micromètres carrés','Millimètres carrés','Centimètres carrés','Décimètres carrés','Mètres carrés','Décamètres carrés','Hectomètres carrés','Kilomètres carrés','Pouces carrés','Pieds carrés','Yards carrés','Milles carrés','Hectares'];
    const arrayVolumes = ['Picomètres cubes','Nanomètres cubes','Micromètres cubes','Millimètres cubes','Centimètres cubes','Décimètres cubes','Mètres cubes','Décamètres cubes','Hectomètres cubes','Kilomètres cubes'];

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
            case 'time':
                setArraySelected([...arrayTime]);
                setType('time');
                resetInputs();
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
            case 'area':
                setArraySelected([...arrayAreas]);
                setType('area');
                resetInputs();
                break;
            case 'volume':
                setArraySelected([...arrayVolumes]);
                setType('volume');
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
            const indice = direction === 'toX' ? ((index - 4)*object.rate) : ((4 - index)*object.rate);
            const result = object.input * (10**(3*indice));
            return result;
        } else {
            const indice = direction === 'toX' ? ((index - 6)*object.rate) : ((6 - index)*object.rate);
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

    const convertAreas = (object,direction) => {
        const index = direction === 'toX' ? object.index : object.target_index;
        let result = 0;
        switch (index) {
            case 10:
                result = direction === 'toX' ? (object.input / 1550) : (object.input * 1550);
                break;
            case 11:
                result = direction === 'toX' ? (object.input / 10.764) : (object.input * 10.764);
                break;
            case 12:
                result = direction === 'toX' ? (object.input / 1.196) : (object.input * 1.196);
                break;
            case 13:
                result = direction === 'toX' ? (object.input * 2.59e6) : (object.input / 2.59e6);
                break;
            case 14:
                result = direction === 'toX' ? (object.input * 10000) : (object.input / 10000);
                break;
            default:
                break;
        }
        return result;
    }

    const convertVolumes = (object,direction) => {
        const index = direction === 'toX' ? object.index : object.target_index;
        let result = 0;
        switch (index) {
            case 10:
                result = direction === 'toX' ? (object.input / 1550) : (object.input * 1550);
                break;
            default:
                break;
        }
        return result;
    }

    const convertMasse = (object,direction) => {
        const index = direction === 'toX' ? object.index : object.target_index;
        let result = 0;
        switch (index) {
            case 10:
                result = direction === 'toX' ? (object.input * 28.35) : (object.input / 28.35);
                break;
            case 11:
                result = direction === 'toX' ? (object.input * 453.6) : (object.input / 453.6);
                break;
            case 12:
                result = direction === 'toX' ? (object.input * 6350) : (object.input / 6350);
                break;
            case 13:
                result = direction === 'toX' ? (object.input * 1e6) : (object.input / 1e6);
                break;
            default:
                break;
        }
        return result;
    }

    //format time display
    const timeDisplay = (time,format) => {
        let finalDate = 0;
        let seconds,minutes,restMinutes,hours,restHours,days,restDays,weeks,restWeeks,months,restMonths,years;
        const mnSec = time => {
            minutes = Math.floor(time/60).toLocaleString('fr', {minimumIntegerDigits: 2})+'mn';
            seconds = (time%60).toLocaleString('fr', {minimumIntegerDigits: 2});
            return minutes+seconds;
        }
        const hoursMin = time => {
            hours = Math.floor(time/3600).toLocaleString('fr', {minimumIntegerDigits: 2})+'h';
            restMinutes = time%3600;
            return hours+mnSec(restMinutes);
        }
        const daysHours = time => {
            days = Math.floor(time/86400)+'j';
            restHours = time%86400;
            return days+hoursMin(restHours);
        }
        const weeksDays = time => {
            weeks = Math.floor(time/604800)+'se';
            restDays = time%604800;
            return weeks+daysHours(restDays);
        }
        const monthsWeeks = time => {
            months = Math.floor(time/2.628e6)+'m';
            restWeeks = time%2.628e6;
            return months+weeksDays(restWeeks);
        }
        switch (format) {
            case 'min':
                minutes = Math.floor(time/60)+'mn';
                seconds = (time%60).toLocaleString('fr', {minimumIntegerDigits: 2});
                finalDate = minutes+seconds
                break;
            case 'hour':
                hours = Math.floor(time/3600)+'h';
                restMinutes = time%3600;
                finalDate = hours+mnSec(restMinutes);
                break;
            case 'day':
                days = Math.floor(time/86400)+'j';
                restHours = time%86400;
                finalDate = days+hoursMin(restHours);
                break;
            case 'week':
                weeks = Math.floor(time/604800)+'se';
                restDays = time%604800;
                finalDate = weeks+daysHours(restDays);
                break;
            case 'month':
                months = Math.floor(time/2.628e6)+'m';
                restWeeks = time%2.628e6;
                finalDate = months+weeksDays(restWeeks);
                break;
            case 'year':
                years = Math.floor(time/3.154e7)+'a';
                restMonths = time%3.154e7;
                finalDate = years+monthsWeeks(restMonths);
                break;
            default:
                break;
        }
        return finalDate;
    }

    const convertTime = (object,direction) => {
        const index = direction === 'toX' ? object.index : object.target_index;
        let result = 0;
        if (index <= 4) {
            const indice = direction === 'toX' ? (index - 4) : (4 - index);
            result = object.input * (10**(3*indice));
        } else {
            switch (index) {
                case 5:
                    result = direction === 'toX' ? (object.input * 60) : timeDisplay(object.input,'min');
                    break;
                case 6:
                    result = direction === 'toX' ? (object.input * 3600) : timeDisplay(object.input,'hour');
                    break;
                case 7:
                    result = direction === 'toX' ? (object.input * 86400) : timeDisplay(object.input,'day');
                    break;
                case 8:
                    result = direction === 'toX' ? (object.input * 604800) : timeDisplay(object.input,'week');
                    break;
                case 9:
                    result = direction === 'toX' ? (object.input * 2.628e6) : timeDisplay(object.input,'month');
                    break;
                case 10:
                    result = direction === 'toX' ? (object.input * 3.154e7) : timeDisplay(object.input,'year');
                    break;
                case 11:
                    result = direction === 'toX' ? (object.input * 3.154e8) : (object.input / 3.154e8);
                    break;
                case 12:
                    result = direction === 'toX' ? (object.input * 3.154e9) : (object.input / 3.154e9);
                    break;
                case 13:
                    result = direction === 'toX' ? (object.input * 3.154e10) : (object.input / 3.154e10);
                    break;
                default:
                    break;
            }
        }
        return result;
    }

    const convertFunct = (id,value) => {
        let result = 0;
        const tempObject = id === 'before' ? {
            index: arraySelected.indexOf(selectedFrom),
            target_index:arraySelected.indexOf(selectedTo),
            input: value,
            rate:1
        } : {
            index: arraySelected.indexOf(selectedTo),
            target_index:arraySelected.indexOf(selectedFrom),
            input: value,
            rate:1
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
                case 'area':
                    tempObject.rate = 2;
                    const squareMeters = tempObject.index <= 9 ? picoKilo(tempObject,'toX') : convertAreas(tempObject,'toX');
                    result = tempObject.target_index <= 9 ? picoKilo({...tempObject,input:squareMeters},'fromX') : convertAreas({...tempObject,input:squareMeters},'fromX');
                    break;
                case 'volume':
                    tempObject.rate = 3;
                    const cubeMeters = tempObject.index <= 9 ? picoKilo(tempObject,'toX') : convertVolumes(tempObject,'toX');
                    result = tempObject.target_index <= 9 ? picoKilo({...tempObject,input:cubeMeters},'fromX') : convertVolumes({...tempObject,input:cubeMeters},'fromX');
                    break;
                case 'time':
                    const seconds = convertTime(tempObject,'toX');
                    result = convertTime({...tempObject,input:seconds},'fromX');
                    break;
                default:
                    break;
            }
        }
        if (!isNaN(result) && result > 1e6) {result = (result/1).toExponential()};
        id === 'before' ? setInputTo(result) : setInputFrom(result);
    }

    const handleInput = e => {
        const id = e.target.id;
        const value = e.target.value;
        id === 'before' ? setInputFrom(value) : setInputTo(value);
        !isNaN(value) && convertFunct(id,value);
    }

    const changeUnities = e => {
        const id = e.target.id;
        id === 'from' ? setSelectedFrom(e.target.value) : setSelectedTo(e.target.value);
    }

    useEffect(() => {
      !isNaN(inputFrom) && convertFunct('before',inputFrom);
    }, [selectedFrom,selectedTo])

    
  return (
    <div className="converter-page">
        <main className="converter-main">
            <h1>Convertisseurs</h1>
            <select name="type" id="type" onChange={selectType}>
                <option value="temperature">Température</option>
                <option value="time">Temps</option>
                <option value="masse">Masses</option>
                <option value="dimensions">Longueurs</option>
                <option value="area">Aires</option>
                <option value="volume">Volumes</option>
            </select>
            <section className="containers">
                <div className="container">
                    <input type="text" name="before" id="before" onChange={handleInput} value={inputFrom} placeholder='0' />
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
                    <input type="text" name="after" id="after"  onChange={handleInput} value={inputTo} placeholder='0' />
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
