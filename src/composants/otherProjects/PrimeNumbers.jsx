import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateGeneralParams } from "../../redux";

export default function PrimeNumbers() {
    document.querySelector('.button-container')?.classList.add('hide');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateGeneralParams({ darkMode: true }));
    }, [])

    const [number, setNumber] = useState('');
    const [numberToCheck, setNumberToCheck] = useState(0);
    const [numberPrime, setNumberPrime] = useState(false);
    const [diviseur, setDiviseur] = useState(0);
    const [arrayPrimes, setArrayPrimes] = useState([]);
    const [showList, setShowList] = useState(false);

    const findAllPremierNumbers = () => {
        const array = [];
        for (let ind = 2; ind < number; ind++) {
            let newNumbPremier = true;
            for (let i = 2; i < ind; i++) {
                Number.isInteger(ind/i) && (newNumbPremier = false);
            }
            newNumbPremier && array.push(ind);
        }
        console.log(array);
        setArrayPrimes(array);
    }

    const resetAll = () => {
        setArrayPrimes([]);
        setDiviseur(0);
        setNumberPrime(false);
    }

    const checkNumber = e => {
        resetAll();
        setNumberToCheck(number);
        e.preventDefault();
        if (number > 1) {
            setNumberPrime(true);
            for (let i = 2; i < number; i++) {
                if (Number.isInteger(number/i)) {
                    setNumberPrime(false);
                    setDiviseur(i);
                    break;
                }
            }
        }
        number < 1000 && findAllPremierNumbers();
    }

    const handleInput = e => {
        const value = e.target.value;
        if (Number.isInteger(value/1)) {
            setNumber(value);
        }
    }

  return (
    <div className="prime-numbers-page">
        <main className="main-prime">
            <h1>Nombre premier ?</h1>
            <form>
                <div className="input-number-container">
                    <label htmlFor="enter-number">Ce nombre est-il premier ?</label>
                    <div className="input">
                        <input type="number" name="enter-number" id="enter-number" onChange={handleInput} value={number} />
                        <button className="valid" onClick={checkNumber}></button>
                    </div>
                </div>
                <div className="input-check-container">
                    <input type="checkbox" name="list-numbers" id="list-numbers" onChange={e => setShowList(e.target.checked)} />
                    <label htmlFor="list-numbers">Avoir la liste des nombres premiers jusqu'à celui-ci</label>
                </div>
            </form>
            {numberToCheck ? <div className="result">
                <h2>Le nombre {numberToCheck} {numberPrime ? 'est' : 'n\'est pas'} un nombre premier{numberPrime ? '.' : (', il est divisible par ' + diviseur)}</h2>
            </div> : null}
            {showList && numberToCheck ? <div className="list-container">
                {numberToCheck > 1000 ? <h3>Il y en a trop, je ne peux pas vous donner la liste complète !!</h3> : null}
                {arrayPrimes.length ? <>
                    <h3>Voici les nombres premiers jusqu'à {numberToCheck} :</h3>
                    <p>{arrayPrimes.map((e,index) => index > 0 ? `, ${e}` : e)}</p>
                </> : null}
            </div> : null}
        </main>
        <Link to="/Projects">
            <button className="previous-page"></button>
        </Link>
    </div>
  )
}
