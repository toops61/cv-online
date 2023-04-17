import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import seipra from '../assets/seipra.webp';
import { updateGeneralParams } from '../redux';
import bayonneEmbarque from '../assets/seipra_proj/01_bayonne_embarques.webp';
import bayonneEmbarque2 from '../assets/seipra_proj/02_Bayonne2.webp';
import bayonneBiv from '../assets/seipra_proj/03_Bayonne_BIV.webp';
import teleoQuai from '../assets/seipra_proj/04_teleo.webp';
import teleoQuaiMeteo from '../assets/seipra_proj/05_teleo-meteo.webp';
import salleDesBillets from '../assets/seipra_proj/06_SDB.webp';
import quaiMetro from '../assets/seipra_proj/07_quais-metro1.webp';
import quaiMetro2 from '../assets/seipra_proj/08_quais-metro2.webp';

export default function Seipra() {
    document.querySelector('.back')?.classList.remove('hide');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateGeneralParams({darkMode:true}));
    }, [])

  return (
    <main className="seipra-page">
        <a className="logo-seipra" href="https://www.seiprascore.com/" target="_blank" rel="noreferrer">
            <img src={seipra} alt="Seipra-Score" />
        </a>
        <h1>Projets pour Seipra Score</h1>
        <section className="screenshots-container">
            <div className="screenshot">
                <div className="screenshot__img">
                    <img src={bayonneEmbarque} alt="Bayonne bus" />
                </div>
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
                <div className="screenshot__img">
                    <img src={bayonneEmbarque2} alt="Bayonne bus2" />
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__img">
                    <img src={bayonneBiv} alt="Bayonne Biv TFT" />
                </div>
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
                <div className="screenshot__img">
                    <img src={teleoQuai} alt="Teleo quai" />
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__img">
                    <img src={teleoQuaiMeteo} alt="Teleo meteo" />
                </div>
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
                <div className="screenshot__img">
                    <img src={salleDesBillets} alt="Salles des billets" />
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__img">
                    <img src={quaiMetro} alt="Teleo meteo" />
                </div>
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
                <div className="screenshot__img">
                    <img src={quaiMetro2} alt="Salles des billets" />
                </div>
            </div>
        </section>
    </main>
  )
}
