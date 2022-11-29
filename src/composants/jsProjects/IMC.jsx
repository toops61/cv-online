import { Link } from "react-router-dom";

export default function IMC() {

  return (
    <main className="imc-page">
        <div className="imc-page__container">
            <h1>Calcul <span>d'IMC</span></h1>
            <form>
                <div className="sections">
                <label htmlFor="height">Votre taille en centimètres</label>
                <input type="number" id="height" />
                </div>
                <div className="sections">
                <label htmlFor="weight">Votre masse en Kg</label>
                <input type="number" id="weight" />
                </div>
            </form>
            <button className="submit">Calculer un <span>IMC</span></button>
            <h3>0</h3>
            <p>En attente du résultat ...</p>
        </div>
        <Link to="/Projects">
            <button className="previous-page"></button>
        </Link>
    </main>
  )
}
