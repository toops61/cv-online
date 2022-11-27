import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
                        <img src={props.item.image} alt="screenshot" />
                    </div>}
            </li>
        )
    }

    const arrayProjects = [
        {
            name:"IMC",
            image:IMCpicture
        },
        {
            name:"Quizz",
            image:quizzPicture
        },
        {
            name:"WikiApp",
            image:wikiPicture
        },
        {
            name:"Cookies",
            image:cookiesPicture
        },
        {
            name:"AppMeteo",
            image:meteoPicture
        },
        {
            name:"CouleursJS",
            image:colorsPicture
        },
        {
            name:"Pomodoro",
            image:pomodoroPicture
        },
        {
            name:"Formulaire",
            image:formPicture
        },
        {
            name:"Jeu de mémoire",
            image:memoryPicture
        },
        {
            name:"Scroll infini",
            image:scrollPicture
        }
    ]
  return (
    <main className="projects-container">
        <section className="project twenty-projects">
            <h2>20 projets JavaScript</h2>
            <img src={logoJs} alt="logo JS" className="logo-js" onClick={toggleWindow}/>
            <div className={projectListVisible ? "projects-list visible" : "projects-list"}>
                <ul>
                    {arrayProjects.map(item => <Project item={item}  key={uuidv4()} />)}
                </ul>
                <p>Projets issus du cours d'<a href="https://www.ecole-du-web.net/courses" target="_blank" rel="noreferrer" title="Ecole du Web">Ecole du Web</a></p>
            </div>
        </section>
    </main>
  )
}