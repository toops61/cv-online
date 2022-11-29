import { Link } from "react-router-dom";

export default function Quizz() {
  return (
    <main className="quizz-page">
      <div className="quizz-page__container">
        <header className="title-container">
          <h1>Quizz</h1>
          <h2>Culture générale ☑️</h2>
          <div className="title-icon"></div>
        </header>
        <section className="questions-container">
        </section>
        <button type="submit"><p>VALIDER</p></button>
        <footer>
          <p>Cliquez sur valider pour vérifier vos réponses</p>
        </footer>
      </div>
      <Link to="/Projects">
            <button className="previous-page"></button>
      </Link>
    </main>
  )
}
