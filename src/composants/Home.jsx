import vinyl from '../assets/vinyl2.webp';
import micro from '../assets/micro.webp';
import logoK from '../assets/logo_K_rouge.webp';
import photoProfil from '../assets/photo_profil.webp';
import photoTV from '../assets/ecran-LCD.webp';
import seipra from '../assets/seipra.webp';
import codeWindow from '../assets/capture-code.webp';
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <main className='home'>
        <section className="left-side">
            <Link className="img-container" to="/SoundEngineer">
                <div className="img vinyl">
                    <img src={vinyl} alt="vinyl" />
                </div>
                <h3>Sound Engineer</h3>
            </Link>
            <Link className="img-container" to="/RadioEngineer">
                <div className="img micro">
                    <img src={micro} alt="micro" />
                </div>
                <h3>Radio Engineer</h3>
            </Link>
        </section>
        <section>
            <div className="img-profil">
                <img src={photoProfil} alt="profil" />
            </div>
        </section>
        <section className="right-side">
            <div className="img-container">
                <div className="text">
                    <h3>Projets code </h3>
                    <h3>professionnels</h3>
                </div>
                <div className="img seipra">
                    <img src={seipra} alt="Seipra score" />
                </div>
            </div>
            <div className="img-container">
                <div className="text">
                    <h3>Projets code </h3>
                    <h3>personnels</h3>
                </div>
                <div className="img code-window">
                    <img src={codeWindow} alt="code" />
                </div>
            </div>
        </section>
        <section className="bottom-links">
            <a className="img-container" href="https://www.kobutsune.com" target="_blank" rel="noref">
                <h3>Kobutsune</h3>
                <div className="img K">
                    <img src={logoK} alt="Kobutsune" />
                </div>
            </a>
            <div className="img-container">
                <h3>Illustration sonore</h3>
                <div className="img TV">
                    <img src={photoTV} alt="Illustrations sonores" />
                </div>
            </div>
        </section>
    </main>
  )
}
