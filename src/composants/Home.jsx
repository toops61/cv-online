import vinyl from '../assets/vinyl2.webp';
import micro from '../assets/micro.webp';
import logoK from '../assets/logo_K_rouge.webp';
import photoProfil from '../assets/photo_profil.webp';
import photoTV from '../assets/ecran-LCD.webp';
import seipra from '../assets/seipra.webp';
import codeWindow from '../assets/capture-code.webp';
export default function Home() {
  return (
    <>
        <main className='home'>
            <section className="left-side">
                <div className="img-container">
                    <div className="img vinyl">
                        <img src={vinyl} alt="vinyl" />
                    </div>
                    <h3>Sound Engineer</h3>
                </div>
                <div className="img-container">
                    <div className="img micro">
                        <img src={micro} alt="micro" />
                    </div>
                    <h3>Radio Engineer</h3>
                </div>
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
                <div className="img-container">
                    <h3>Kobutsune</h3>
                    <div className="img K">
                        <img src={logoK} alt="Kobutsune" />
                    </div>
                </div>
                <div className="img-container">
                    <h3>Illustration sonore</h3>
                    <div className="img TV">
                        <img src={photoTV} alt="Illustrations sonores" />
                    </div>
                </div>
            </section>
        </main>
    </>
  )
}
