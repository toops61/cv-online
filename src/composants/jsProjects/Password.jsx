import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateGeneralParams } from "../../redux";

export default function Password() {
  document.querySelector('.button-container')?.classList.add('hide');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateGeneralParams({darkMode:true}));
  }, [])

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [clipboardVisible, setClipboardVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordParams, setPasswordParams] = useState({
    length:4,
    lowercase:false,
    uppercase:false,
    integers:false,
    specials:false
  })

  const displayAlertMessage = message => {
    setAlertVisible(true);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2500);
  }

  const displayClipboardCopy = () => {
    setClipboardVisible(true);
    setTimeout(() => {
      setClipboardVisible(false);
    }, 2000);
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(password).then(() => displayClipboardCopy(),error => console.log(error));
  }

  const getValue = e => {
    const tempObject = {...passwordParams};
    tempObject[e.target.id] = e.target.id === 'length' ? e.target.value : e.target.checked;
    setPasswordParams({...tempObject});
  }

  const generateRandomNumbers = lettersNumbersString => {
    let codeArray = new Uint32Array(passwordParams.length);
    crypto.getRandomValues(codeArray);
    codeArray = codeArray.map(e => {
        const newNumber = e / 4294967296;
        const index = Math.floor(newNumber * lettersNumbersString.length);
        return index;
    })
    return codeArray;
  }

  const getCharacters = (first,last) => {
    let string ='';
    for (let i = first; i <= last; i++) {
        string += (String.fromCharCode(i))
    }
    return string;
  }

  const concatenateCaracters = (array,string) => {
    let password = '';
    array.map(e => {
        password += string[e];
    })
    return password;
}

  const generatePassword = e => {
    e.preventDefault();
    const lowercaseLetters = getCharacters(97,122);
    const uppercaseLetters = getCharacters(65,90);
    const allIntegers = getCharacters(48,57);
    const specialsCaracters = getCharacters(33,47)+getCharacters(58,64)+getCharacters(91,96)+getCharacters(123,126);

    if (Object.values(passwordParams).some(e => e === true)) {     
        const lettersNumbersString = (passwordParams.lowercase ? lowercaseLetters : '') + (passwordParams.uppercase ? uppercaseLetters : '') + (passwordParams.integers ? allIntegers : '') + (passwordParams.specials ? specialsCaracters : '');
        const array = generateRandomNumbers(lettersNumbersString);
        const newPassword =concatenateCaracters(array,lettersNumbersString);
        setPassword(newPassword);
    } else {
        displayAlertMessage('Vous devez sélectionner au moins un paramètre');
    }
  }

  return (
    <div className="password-generator-page">
      {alertVisible && <div className="alert-window ">
        <div className="alert-box">
          <h2>{alertMessage}</h2>
        </div>
      </div>}
    <main className="password-main">
      <h1>Votre mot de passe</h1>
      <div className="result">
        <p>{password}</p>
        <div className="copy-icon" onClick={copyPassword}></div>
        {clipboardVisible && <div className="clipboard"><p>mot de passe copié</p></div>}
      </div>
      <form>
        <label htmlFor="length"><p>Taille du mot de passe : <span>{passwordParams.length}</span></p></label>
        <input type="range" name="length" id="length" min="4" max="30" defaultValue="4" onChange={getValue} />
        <div className="input-container">
          <input type="checkbox" name="lowercase" id="lowercase" onChange={getValue} />
          <label htmlFor="lowercase">Contient des caractères minuscules</label>
        </div>
        <div className="input-container">
          <input type="checkbox" name="uppercase" id="uppercase" onChange={getValue} />
          <label htmlFor="uppercase">Contient des caractères majuscules</label>
        </div>
        <div className="input-container">
          <input type="checkbox" name="integers" id="integers" onChange={getValue} />
          <label htmlFor="integers">Contient des nombres</label>
        </div>
        <div className="input-container">
          <input type="checkbox" name="specials" id="specials" onChange={getValue} />
          <label htmlFor="specials">Contient des caractères spéciaux</label>
        </div>
        <button className="button-generate" onClick={generatePassword}>Générer</button>
      </form>
    </main>
    <Link to="/Projects">
        <button className="previous-page"></button>
    </Link>
    </div>
  )
}