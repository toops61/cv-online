import logoJs from '../assets/perso_proj/Unofficial_JavaScript_logo.svg';
import IMCpicture from '../assets/perso_proj/IMC_screenshot.png';
import quizzPicture from '../assets/perso_proj/Quizz_screenshot.png';
import wikiPicture from '../assets/perso_proj/wiki_screenshot.png';
import cookiesPicture from '../assets/perso_proj/cookies_screenshot.png';
import meteoPicture from '../assets/perso_proj/meteo_screenshot.png';
import colorsPicture from '../assets/perso_proj/colors_screenshot.png';
import pomodoroPicture from '../assets/perso_proj/pomodoro_screenshot.png';
import formPicture from '../assets/perso_proj/form_screenshot.png';
import memoryPicture from '../assets/perso_proj/memory_screenshot.png';
import scrollPicture from '../assets/perso_proj/scroll_screenshot.png';
import sliderPicture from '../assets/perso_proj/slider_screenshot.png';
import passwordPicture from '../assets/perso_proj/password_screenshot.png';
import filterPicture from '../assets/perso_proj/filtre_screenshot.png';
import videoPicture from '../assets/perso_proj/video_screenshot.png';
import morpionPicture from '../assets/perso_proj/morpion_screenshot.png';
import particulesPicture from '../assets/perso_proj/particules_screenshot.png';
import animationPicture from '../assets/perso_proj/anim_screenshot.png';
import typingPicture from '../assets/perso_proj/frappe_screenshot.png';
import calcPicture from '../assets/perso_proj/calculate_screenshot.png';
import audioPicture from '../assets/perso_proj/audio_screenshot.png';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

export default function Projects() {
    const [projectListVisible, setProjectListVisible] = useState(false);
    const toggleWindow = () => setProjectListVisible(!projectListVisible);

    const Project = props => {
        const [imageVisible, setImageVisible] = useState(false);
        const handleImage = () => setImageVisible(!imageVisible);
        return (
            <li className="project">
                <p onClick={handleImage}>{props.item.name}</p>
                {imageVisible && 
                    <div className="screen-shot">
                        <Link to={props.item.link}>
                            <img src={props.item.image} alt="screenshot" />
                        </Link>
                    </div>}
            </li>
        )
    }

    const arrayProjects = [
        {
            name:"IMC",
            image:IMCpicture,
            link:"/Imc"
        },
        {
            name:"Quizz",
            image:quizzPicture,
            link:"/Quizz"
        },
        {
            name:"WikiApp",
            image:wikiPicture,
            link:"/WikiApp"
        },
        {
            name:"Cookies",
            image:cookiesPicture,
            link:"/Cookies"
        },
        {
            name:"AppMeteo",
            image:meteoPicture,
            link:"/AppMeteo"
        },
        {
            name:"CouleursJS",
            image:colorsPicture,
            link:"/CouleursJS"
        },
        {
            name:"Pomodoro",
            image:pomodoroPicture,
            link:"/Pomodoro"
        },
        {
            name:"Formulaire",
            image:formPicture,
            link:"/Formulaire"
        },
        {
            name:"Jeu de mémoire",
            image:memoryPicture,
            link:"/Memory"
        },
        {
            name:"Scroll infini",
            image:scrollPicture,
            link:"/Scroll"
        },
        {
            name:"Slider",
            image:sliderPicture,
            link:"/Slider"
        },
        {
            name:"Générateur de mots de passe",
            image:passwordPicture,
            link:"/Password"
        },
        {
            name:"Liste filtrable",
            image:filterPicture,
            link:"/Filter"
        },
        {
            name:"Custom lecteur vidéo",
            image:videoPicture,
            link:"/VideoPlayer"
        },
        {
            name:"Jeu du morpion",
            image:morpionPicture,
            link:"/Morpion"
        },
        {
            name:"Particules en JS avec canvas",
            image:particulesPicture,
            link:"/Particules"
        },
        {
            name:"Animations",
            image:animationPicture,
            link:"/Animate"
        },
        {
            name:"Jeu de frappe",
            image:typingPicture,
            link:"/Typing"
        },
        {
            name:"Calculatrice",
            image:calcPicture,
            link:"/Calculator"
        },
        {
            name:"Player audio",
            image:audioPicture,
            link:"/AudioPlayer"
        },
    ]
  return (
    <main className="projects-container">
        <section className="project twenty-projects">
            <h2>20 projets JavaScript</h2>
            <img src={logoJs} alt="logo JS" className="logo-js" onClick={toggleWindow}/>
            <div className={projectListVisible ? "projects-list visible" : "projects-list"}>
                <ul>
                    {arrayProjects.map(item => <Project item={item} key={uuidv4()} />)}
                </ul>
                <p>Projets issus du cours d'<a href="https://www.ecole-du-web.net/courses" target="_blank" rel="noreferrer" title="Ecole du Web">Ecole du Web</a></p>
            </div>
        </section>
    </main>
  )
}