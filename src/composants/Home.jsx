import vinyl from '../assets/vinyl2.webp';
import micro from '../assets/micro.webp';
import logoK from '../assets/logo_K_rouge.webp';
import photoMac from '../assets/clavier_mac960.webp';
import photoTV from '../assets/ecran-LCD.webp';
import seipra from '../assets/seipra.webp';
import codeWindow from '../assets/capture-code.webp';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateGeneralParams } from '../redux';

export default function Home() {
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateGeneralParams({darkMode:false}));
}, [])

    document.querySelector('.button-container')?.classList.remove('hide');
  return (
    <main className='home'>
        <section className="left-side">
            <Link className="img-container sound-engineer" to="/SoundEngineer">
                <div className="img vinyl">
                    <img src={vinyl} alt="vinyl" />
                </div>
                <h3>Sound Engineer</h3>
                <div className="perso-wire">
                    <div className="first-part">
                        <div className="fill"></div>
                    </div>
                    <div className="second-part">
                        <div className="fill"></div>
                    </div>
                    <div className="third-part">
                        <div className="fill"></div>
                    </div>
                </div>
            </Link>
            <Link className="img-container radio" to="/RadioEngineer">
                <div className="img micro">
                    <img src={micro} alt="micro" />
                </div>
                <h3>Radio Engineer</h3>
                <div className="perso-wire">
                    <div className="first-part">
                        <div className="fill"></div>
                    </div>
                    <div className="second-part">
                        <div className="fill"></div>
                    </div>
                    <div className="third-part">
                        <div className="fill"></div>
                    </div>
                </div>
            </Link>
        </section>
        <section>
            <div className="img-profil">
                <img src={photoMac} alt="profil" />
            </div>
        </section>
        <section className="right-side">
            <div className="img-container pro-proj">
                <div className="text">
                    <h3>Projets code </h3>
                    <h3>professionnels</h3>
                </div>
                <div className="img seipra">
                    <img src={seipra} alt="Seipra score" />
                </div>
                <div className="perso-wire">
                    <div className="first-part">
                        <div className="fill"></div>
                    </div>
                    <div className="second-part">
                        <div className="fill"></div>
                    </div>
                </div>
            </div>
            <Link className="img-container perso-proj" to="/Projects">
                <div className="perso-wire">
                    <div className="first-part">
                        <div className="fill"></div>
                    </div>
                    <div className="second-part">
                        <div className="fill"></div>
                    </div>
                    <div className="third-part">
                        <div className="fill"></div>
                    </div>
                </div>
                <div className="text">
                    <h3>Projets code </h3>
                    <h3>personnels</h3>
                </div>
                <div className="img code-window">
                    <img src={codeWindow} alt="code" />
                </div>
            </Link>
        </section>
        <section className="bottom-links">
            <a className="img-container kobutsune" href="https://www.kobutsune.com" target="_blank" rel="noreferrer">
                <h3>Kobutsune</h3>
                <div className="img K">
                    <img src={logoK} alt="Kobutsune" />
                </div>
                <div className="perso-wire">
                    <div className="first-part">
                        <div className="fill"></div>
                    </div>
                    <div className="second-part">
                        <div className="fill"></div>
                    </div>
                </div>
            </a>
            <div className="img-container sound-design">
                <h3>Illustration sonore</h3>
                <div className="img TV">
                    <img src={photoTV} alt="Illustrations sonores" />
                </div>
                <div className="perso-wire">
                    <div className="first-part">
                        <div className="fill"></div>
                    </div>
                    <div className="second-part">
                        <div className="fill"></div>
                    </div>
                </div>
            </div>
        </section>
    </main>
  )
}
