import { useState } from "react"
import { Link } from "react-router-dom";

export default function Formulaire() {
  document.querySelector('.button-container')?.classList.add('hide');
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertObject, setAlertObject] = useState({
    message1:'',
    message2:'',
    type:0
  });
  const [formArray, setFormArray] = useState([
    {
      content:'',
      valid:''
    },
    {
      content:'',
      valid:''
    },
    {
      content:'',
      valid:''
    },
    {
      content:'',
      valid:''
    },
  ]);
  const [passwordLevel, setPasswordLevel] = useState(0);

  const alertWindow = (message,type,message2) => {
    const tempObject = {...alertObject};
    setAlertVisible(true);
    tempObject.message1 = message;
    tempObject.type = type;
    tempObject.message2 = message2;
    setAlertObject({...tempObject});
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  }

  const checkPseudo = e => {
    const array = [...formArray];
    const regExpPseudo = new RegExp(/^\w{3,50}$/);
    const value = e.target.value;
    array[0].content = value;
    array[0].valid = regExpPseudo.test(value) ? 'valid' : 'invalid';
    !e.target.value && (array[0].valid = '');
    setFormArray([...array]);
  }
  
  const checkEmail = e => {
    const array = [...formArray];
    const regExpEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/);
    const value = e.target.value;
    array[1].content = value;
    array[1].valid = regExpEmail.test(value) ? 'valid' : 'invalid';
    !e.target.value && (array[1].valid = '');
    setFormArray([...array]);
  }
  
  const checkPassword = e => {
    const array = [...formArray];
    const regExpPassword = new RegExp(/^(?=.*[0-9])(?=.*[a-zÞ-öø-ÿ])(?=.*[A-ZÀ-ÖØ-Ý])(?=.*[^0-9a-zÞ-öø-ÿA-ZÀ-ÖØ-Ý ]).{6,60}$/);
    const value = e.target.value;
    array[2].content = value;
    array[2].valid = regExpPassword.test(value) ? 'valid' : 'invalid';
    !e.target.value && (array[2].valid = '');
    setFormArray([...array]);
  }
  
  const testPassword = e => {
    const value = e.target.value;
    const totalNumbers = value.length - value.replace(/[0-9]/g,'').length;
    const totalMaj = value.length - value.replace(/[A-Z]/g,'').length;
    const totalSpecials = value.length - value.replace(/[^0-9a-zÞ-öø-ÿA-ZÀ-ÖØ-Ý]/g,'').length;
    console.log(totalNumbers,totalMaj,totalSpecials);
    if (value.length > 12 && totalNumbers > 2 && totalMaj > 2 && totalSpecials > 2) {
        console.log('level 3');
        setPasswordLevel(3);
      } else if (value.length > 8 && totalNumbers > 1 && totalMaj > 1 && totalSpecials > 1) {
      console.log('level 2');
      setPasswordLevel(2);
    } else if (value.length > 5 && totalNumbers > 0 && totalMaj > 0 && totalSpecials > 0) {
      console.log('level 1');
        setPasswordLevel(1);
      } else {
        setPasswordLevel(0);
    }
  }

  const confirmPassword = e => {
    const array = [...formArray];
    const value = e.target.value;
    array[3].content = value;
    array[2].valid = value === formArray[2].content ? 'valid' : 'invalid';
    setFormArray([...array]);
  }

  const checkAllValid = e => {
    e.preventDefault();
    if (formArray.every(el => el.valid === 'valid')) {
      passwordLevel < 3 ? alertWindow('Félicitations, votre compte est créé',0,'vous pouvez renforcer votre mot de passe') : alertWindow('Félicitations, votre compte est créé',0);
    } else if (formArray.some(el => !el.content)) {
        alertWindow('Attention, vous devez remplir tous les champs !',1,'');
    } else {
        alertWindow('Attention, les champs ne sont pas correctement remplis !',1,'');
    }
  }

  return (
    <div className="valid-form-page">
      <div className="main-formulaire">
        {alertVisible && <div className="alert-window">
          <div className={alertObject.type === 1 ? "alert-container alert" : "alert-container"}>
            <h2>{alertObject.message1}</h2>
            <p>{alertObject.message2}</p>
          </div>
        </div>}
        <section className="form-container">
        <form onSubmit={checkAllValid}>
          <h1>Inscrivez-vous</h1>
          <div className={`input-container ${formArray[0].valid}`}>
            <label htmlFor="pseudo">Nom d'utilisateur</label>
            <input type="text" name="pseudo" id="pseudo" placeholder="3 caractères minimum" onChange={checkPseudo} value={formArray[0].content} required />
            <div className="attention"><p>!</p></div>
            <div className="check"></div>
            <p className="input-infos">Choisissez un pseudo contenant au moins trois caractères.</p>
          </div>
          <div className={`input-container ${formArray[1].valid}`}>
            <label htmlFor="email">Entrez votre email</label>
            <input type="email" name="email" id="email" placeholder="Votre email" onChange={checkEmail} value={formArray[1].content} required />
            <div className="attention"><p>!</p></div>
            <div className="check"></div>
            <p className="input-infos">Rentrez un email valide.</p>
          </div>
          <div className={`input-container ${formArray[2].valid}`}>
            <label htmlFor="password">Mot de passe</label>
            <input type="password" name="password" id="password" placeholder="Votre mot de passe" onChange={checkPassword} onInput={testPassword} value={formArray[2].content} required />
            <div className="attention"><p>!</p></div>
            <div className="check"></div>
            <p className="input-infos">Au moins un symbole, un chiffre, une majuscule et 6 caractères minimum</p>
            {passwordLevel > 0 && <div className="password-level">
              <div className="level"><p>faible</p></div>
              {passwordLevel > 1 && <div className="level"><p>moyen</p></div>}
              {passwordLevel > 2 && <div className="level"><p>fort</p></div>}
            </div>}
          </div>
          <div className="input-container">
            <label htmlFor="confirm-password">confirmez le mot de passe</label>
            <input type="password" name="confirm-password" id="confirm-password" placeholder="Confirmez votre mot de passe" onChange={confirmPassword} value={formArray[3].content} required />
            <div className="attention"><p>!</p></div>
            <div className="check"></div>
            <p className="input-infos">Le mot de passe n'est pas identique</p>
          </div>
          <button type="submit">Création du compte</button>
        </form>
      </section>
      </div>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  )
}
