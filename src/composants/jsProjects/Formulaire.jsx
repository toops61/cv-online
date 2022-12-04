import { useState } from "react"

export default function Formulaire() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
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

  const checkPseudo = e => {
    const array = [...formArray];
    const regExpPseudo = new RegExp(/^\w{3,50}$/);
    const value = e.target.value;
    array[0].content = value;
    array[0].valid = regExpPseudo.test(value) ? 'valid' : 'invalid';
    setFormArray([...array]);
  }
  
  const checkEmail = e => {
    const array = [...formArray];
    const regExpEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/);
    const value = e.target.value;
    array[1].content = value;
    array[1].valid = regExpEmail.test(value) ? 'valid' : 'invalid';
    setFormArray([...array]);
  }
  
  const checkPassword = e => {
    const array = [...formArray];
    const regExpPassword = new RegExp(/^(?=.*[0-9])(?=.*[a-zÞ-öø-ÿ])(?=.*[A-ZÀ-ÖØ-Ý])(?=.*[^0-9a-zÞ-öø-ÿA-ZÀ-ÖØ-Ý ]).{6,60}$/);
    const value = e.target.value;
    array[2].content = value;
    array[2].valid = regExpPassword.test(value) ? 'valid' : 'invalid';
    setFormArray([...array]);
}


  const checkAllValid = e => {
    e.preventDefault();
    console.log(e);
    /* if (Array.from(inputContainer).every(e => e.className === 'input-container valid')) {
        alertWindow('Félicitations, votre compte est créé',0);
        document.querySelector('.alert-container p').textContent = document.querySelectorAll('.level')[1].className.includes('hide-level') ? 'vous pouvez renforcer votre mot de passe' : '';
    } else if (Array.from(document.querySelectorAll('input')).some(e => e.value === '')) {
        alertWindow('Attention, vous devez remplir tous les champs !',1);
    } else {
        alertWindow('Attention, les champs ne sont pas correctement remplis !',1);
    } */
  }

  return (
    <div className="valid-form-page">
      <div className="main-formulaire">
        {alertVisible && <div className="alert-window">
          <div className="alert-container">
            <h2>{alertMessage}</h2>
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
            <input type="password" name="password" id="password" placeholder="Votre mot de passe" onChange={checkPassword} value={formArray[2].content} required />
            <div className="attention"><p>!</p></div>
            <div className="check"></div>
            <p className="input-infos">Au moins un symbole, un chiffre, une majuscule et 6 caractères minimum</p>
            {passwordLevel > 0 && <div className="password-level">
              <div className="level"><p>faible</p></div>
              <div className="level"><p>moyen</p></div>
              <div className="level"><p>fort</p></div>
            </div>}
          </div>
          <div className="input-container">
            <label htmlFor="confirm-password">confirmez le mot de passe</label>
            <input type="password" name="confirm-password" id="confirm-password" placeholder="Confirmez votre mot de passe" required />
            <div className="attention"><p>!</p></div>
            <div className="check"></div>
            <p className="input-infos">Le mot de passe n'est pas identique</p>
          </div>
          <button type="submit">Création du compte</button>
        </form>
      </section>
      </div>
    </div>
  )
}
