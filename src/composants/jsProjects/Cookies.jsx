import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Cookies() {
  document.querySelector('.button-container')?.classList.add('hide');
  
  const [showErrorWindow, setShowErrorWindow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookieObject, setCookieObject] = useState({
    name: "",
    value: "",
  });
  const [cookiesArray, setCookiesArray] = useState([]);
  const [cookiesVisibles, setCookiesVisibles] = useState(false);

  const handleErrorWindow = (message) => {
    setShowErrorWindow(!showErrorWindow);
    setErrorMessage(message);
  };

  useEffect(() => {
    showErrorWindow &&
      setTimeout(() => {
        handleErrorWindow();
      }, 2000);
  }, [showErrorWindow]);

  const addCookieToArray = () => {
    const array = document.cookie ? document.cookie.split(";") : [];
    const newArray = array.map((el) => {
      const object = {};
      object["name"] = el.split("=")[0];
      object["value"] = el.split("=")[1];
      return object;
    });
    setCookiesArray([...newArray]);
  };

  useEffect(() => {
    document.cookie && addCookieToArray();
  }, []);

  const deleteCard = (index) => {
    if (window.confirm("Voulez vous vraiment effacer ce cookie ?")) {
      const name = cookiesArray[index].name;
      document.cookie = `${name}= ; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      handleErrorWindow("Cookie effacé");
      addCookieToArray();
    }
  };

  const createCookie = () => {
    const cookieName = cookieObject.name;
    const cookieValue = cookieObject.value;
    if (cookieName !== "" && cookieValue !== "") {
      handleErrorWindow(
        cookiesArray.includes(cookieName)
          ? "Vous avez modifié votre cookie"
          : "Vous avez créé un nouveau cookie"
      );
      const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60000);
      document.cookie = `${cookieName}=${cookieValue}; expires=${expirationDate}; Secure;`;
      addCookieToArray();
      setCookieObject({ name: "", value: "" });
    } else {
      handleErrorWindow("Vous devez remplir les champs !");
    }
  };

  const handleCookie = (e) => {
    const tempObject = { ...cookieObject };
    tempObject[e.target.id.split("cookie-")[1]] = e.target.value;
    setCookieObject({ ...tempObject });
  };

  const resetObjectKey = (index) => {
    const tempObject = { ...cookieObject };
    tempObject[Object.keys(tempObject)[index]] = "";
    setCookieObject({ ...tempObject });
  };

  const CookieCard = (props) => {
    const cookie = props.cookie;
    return (
      <div className="cookie-card">
        <p>
          <span>Name : </span>
          {cookie.name}
        </p>
        <p>
          <span>Valeur : </span>
          {cookie.value}
        </p>
        <button onClick={(e) => deleteCard(props.index)}>
          <p>Supprimer</p>
        </button>
      </div>
    );
  };

  const showCookies = () => setCookiesVisibles(!cookiesVisibles);

  return (
    <div className="cookies-page">
      <main className="main-cookies">
        {showErrorWindow && (
          <div className="alert-container">
            <div className="alert-window">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
        <h1>
          <span>Création de</span> Cookies 🍪
        </h1>
        <form>
          <div className="input-container">
            <label htmlFor="cookie-name">Son nom</label>
            <input
              type="text"
              name="cookie-name"
              id="cookie-name"
              onChange={handleCookie}
              value={cookieObject.name}
              required
            />
            <button className="reset" onClick={(e) => resetObjectKey(0)}>
              X
            </button>
          </div>
          <div className="input-container">
            <label htmlFor="cookie-value">Sa valeur</label>
            <input
              type="text"
              name="cookie-value"
              id="cookie-value"
              onChange={handleCookie}
              value={cookieObject.value}
              required
            />
            <button className="reset" onClick={(e) => resetObjectKey(1)}>
              X
            </button>
          </div>
        </form>
        <div className="buttons-container">
          <button className="create-button" onClick={createCookie}>
            Créer
          </button>
          <button className="display-button" onClick={showCookies}>
            {cookiesVisibles ? "Masquer" : "Afficher"}
          </button>
        </div>
        {cookiesVisibles && (
          <div className="cookie-container">
            {cookiesArray.length ? (
              cookiesArray.map((cookie, index) => (
                <CookieCard cookie={cookie} index={index} key={uuidv4()} />
              ))
            ) : (
              <p>Pas de cookies pour le moment</p>
            )}
          </div>
        )}
      </main>
      <Link to="/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  );
}
