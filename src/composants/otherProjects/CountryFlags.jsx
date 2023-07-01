import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { updateGeneralParams } from "../../redux";
import { useQuery } from "react-query";

export default function CountryFlags() {
    const [countryCodes, setCountryCodes] = useState([]);
    const [countrySearch, setCountrySearch] = useState('');
    const [flagUrl, setFlagUrl] = useState('');
    const [topMessage, setTopMessage] = useState('');

    const dispatch = useDispatch();

    const arraySizes = [20,40,80,160,320,640,1280,2560];

    const { data,isLoading,error } = useQuery('countries',async () => {
        const result = await fetch('https://flagcdn.com/fr/codes.json');
        return result.json();
    })

    const changeIntoArray = () => {
        const keysArray = Object.keys(data);
        const newArray = keysArray.map(e => {
            const tempObj = {
                name: data[e],
                short: e
            };
            return tempObj;
        });
        setCountryCodes(newArray);
    }

    useEffect(() => {
      data && changeIntoArray();
    }, [data]);

    const searchCountry = word => {
        const country = countryCodes.find(e => compareStrings(word,e.name));
        country ? setFlagUrl(`https://flagcdn.com/w640/${country.short}.png`) : setTopMessage('Pas de pays trouvé');
    }

    const transformString = e => {
        let newString = e.toLowerCase();
        newString = newString.replace(/[éèêë]/ig,'e');
        newString = newString.replace(/[âáàåäã]/ig,'a');
        newString = newString.replace(/[îìïí]/ig,'i');
        newString = newString.replace(/[ôóòõøö]/ig,'o');
        newString = newString.replace(/[-]/ig,' ');
        return newString;
    }

    const compareStrings = (a,b) => transformString(a) === transformString(b) ? true : false;

    const handleInput = e => {
        flagUrl && setFlagUrl('');
        let countryName = e.target.value;
        setCountrySearch(countryName);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const countryEntered = e.target[0].value;
        searchCountry(countryEntered);
    }

    useEffect(() => {
      dispatch(updateGeneralParams({darkMode:true}));
    }, []);

    useEffect(() => {
      topMessage && setTimeout(() => {
        setTopMessage('');
      }, 3000);
    }, [topMessage]);
        
    
  return (
    <main className="flags-page">
        <form onSubmit={handleSubmit}>
            <label htmlFor="country">Pays : </label>
            <input type="text" name="country" id="country" onChange={handleInput} value={countrySearch} />
            <button type="submit">drapeau</button>
        </form>
        {topMessage ? <h2>{topMessage}</h2> : <></>}
        {flagUrl ? 
            <div className="flag-container">
            <div className="flag-image">
                <img src={flagUrl} alt="drapeau" />
            </div>
            </div> : 
        <></>}
    </main>
  )
}
