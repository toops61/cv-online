import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import seipra from '../assets/seipra.webp';
import { updateGeneralParams } from '../redux';

export default function Seipra() {
    const dispatch = useDispatch();

    const [projectsArray, setProjectsArray] = useState([
        {
            sentence:'',
            image:'',
            playedImages:[],
            visible:false
        },
        {
            sentence:'',
            image:'',
            playedImages:[],
            visible:false
        },
        {
            sentence:'',
            image:'',
            playedImages:[],
            visible:false
        },
        {
            sentence:'',
            image:'',
            playedImages:[],
            visible:false
        },
        {
            sentence:'',
            image:'',
            playedImages:[],
            visible:false
        }
    ])

    const timeoutArray = [null,null,null,null,null];

    let projectsFixArray = [
        {
            project:'bayonne',
            sentences:['Ecrans embarqués dans les bus de Bayonne.','Horloge dynamique en CSS. Récupération et affichage des données dynamiques via le service embarqué et les données G.T.F.S : Noms des stations, destination, temps d\'attente, pictogrammes... ','','Affichage des P.O.I (point of interest) lorsque le bus est à l\'arrêt. Interrogation de la base de données pour déterminer le nom des arrêts ou/et correspondances.','','Affichage en temps réel du thermomètre de ligne, des déviations ou incidents de parcours.','','Ecrans adaptés à l\'état du bus tout au long du parcours.','','Adaptation du thermomètre de ligne suivant la progression.','Arrêts remarquables.','Délocalisation.','Fin de parcours.','messages d\'information à destination des usagers.','Affichage de l\'accessibilité des lignes pour les personnes à mobilité réduite. Possibilité de messages vocaux "text-to-speech" pour les personnes malvoyantes contenant les informations affichées à l\'écran.'],
            images:[]
        },
        {
            project:'bayonneBiv',
            sentences:['Affichage sur les bornes d\'information voyageurs pour Bayonne. Récupération des données et affichage en temps réel des prochaines passages à l\'arrêt, pour chaque ligne, avec récupération des noms et pictogrammes.','','Affichage de deux ou trois pages suivant le nombre d\'horaires.','Dernier ou prochain passage en temps réel.','','Réduction de nombre de lignes affichées si peu ou plus de passages.','','Choix du nombre de lignes affichées de manière responsive.','','Affichage uniquement des horaires quand absence de messages avec une taille adaptée à l\'écran.','','Affichage dynamiques des messages suivant leur présence et leur priorité. Alternance ou défilement sous les horaires.','','','Récupération de l\'état en temps réel : retard, indisponibilité, reprise ou fin de service.'],
            images:[]
        },
        {
            project:'teleo',
            sentences:['Affichage des bornes d\'information voyageurs à Toulouse pour Teleo, le téléphérique.','Récupération de l\'état et des temps de passage en temps réel avec utilisation de WebSockets.','Affichage de la météo du jour grâce à une API dédiée.','Affichage dynamiques de messages pour les voyageurs, suivant leur priorité.','','Mise à jour de l\'état en temps réel.','Utilisation du Text-to-speech pour les personnes malvoyantes munies d\'un dispositif.'],
            images:[]
        },
        {
            project:'sdb',
            sentences:[],
            images:[]
        },
        {
            project:'tisseoMetro',
            sentences:[],
            images:[]
        }
    ];

    const observer = new IntersectionObserver(
        entries => {
            entries.map(e => {
                if (e.isIntersecting) {
                    const ind = Array.from(document.querySelectorAll('.screenshot')).findIndex(el => el === e.target);
                    if (ind !== -1) {
                        setProjectsArray(projectsArray => {
                            const tempProjects = [...projectsArray];
                            if (projectsArray[ind].image) {
                                timeoutLoop(ind,tempProjects);
                                tempProjects.splice(ind,1,{...tempProjects[ind],playedImages:[projectsFixArray[ind].images[0]],visible:true});
                                return tempProjects
                            }
                        });
                    } 
                    e.target.classList.add('appears');
                } else {
                    const ind = Array.from(document.querySelectorAll('.screenshot')).findIndex(el => el === e.target);
                    e.target.classList.remove('appears');
                    if (ind !== -1) {
                        setProjectsArray(projectsArray => {
                            const tempProjects = [...projectsArray];
                            if (projectsArray[ind].image) {
                                clearTimeout(timeoutArray[ind]);
                                tempProjects.splice(ind,1,{
                                    sentence:projectsFixArray[ind].sentences[0] ? projectsFixArray[ind].sentences[0] : '',
                                    image:projectsFixArray[ind].images[0],
                                    playedImages:[],
                                    visible:false
                                });
                                return tempProjects
                            }
                        });
                    } 
                }
            });
    },{threshold:.7});

    const importAll = r => {
       return r.keys().map(r);
    };
    
    const getProjectsImages = () => {
        let screenshots;
        projectsFixArray.map((project,index) => {
            switch (index) {
                case 0:
                    screenshots = importAll(require.context(`../assets/seipra_proj/bayonne`, false, /\.(webp)$/));
                    break;
                case 1:
                    screenshots = importAll(require.context(`../assets/seipra_proj/bayonneBiv`, false, /\.(webp)$/));
                    break;
                case 2:
                    screenshots = importAll(require.context(`../assets/seipra_proj/teleo`, false, /\.(webp)$/));
                    break;
                case 3:
                    screenshots = importAll(require.context(`../assets/seipra_proj/sdb`, false, /\.(webp)$/));
                    break;
                case 4:
                    screenshots = importAll(require.context(`../assets/seipra_proj/tisseoMetro`, false, /\.(webp)$/));
                    break;
                default:
                    break;
            };
            const array = [...screenshots];
            projectsFixArray[index] = {
                ...projectsFixArray[index],
                images:array
            }
        })
    }

    const timeoutLoop = (index,projects) => {
        const project = projects[index];
        clearTimeout(timeoutArray[index]);
        const displayedImageTimeout = setTimeout(() => {
            const displayedImageIndex = project.playedImages.length < projectsFixArray[index].images.length ? projectsFixArray[index].images.findIndex(image => !project.playedImages.includes(image)) : 0;
            if (displayedImageIndex !== -1 && projectsFixArray[index].images.length > 1) {
                const newSentence = projectsFixArray[index].sentences[displayedImageIndex] ? projectsFixArray[index].sentences[displayedImageIndex] : '';
                project.image = projectsFixArray[index].images[displayedImageIndex];
                newSentence && (project.sentence = newSentence);
                if (displayedImageIndex > 0) {
                    project.playedImages.push(projectsFixArray[index].images[displayedImageIndex]);
                } else {
                    project.playedImages = [projectsFixArray[index].images[displayedImageIndex]];
                }
                setProjectsArray(projectsArray => {
                    const projects = [...projectsArray];
                    projects.splice(index,1,project);
                    return [...projects];
                });
                timeoutLoop(index,projects);
            }
        }, 5000);
        timeoutArray[index] = displayedImageTimeout;
    }
    
    useEffect(() => {
        getProjectsImages();
        document.querySelector('.back')?.classList.remove('hide');
        document.querySelector('.button-container')?.classList.add('hide');
        dispatch(updateGeneralParams({darkMode:true}));
    }, [])
    
    useEffect(() => {
        if (projectsFixArray.every(e => e.images.length)) {
            const tempProjects = projectsArray.map(project => {return {...project}});
            tempProjects.map((project,id) => {
                project.image = projectsFixArray[id].images[0];
                project.playedImages.push(projectsFixArray[id].images[0]);
                project.sentence = projectsFixArray[id].sentences.length ? projectsFixArray[id].sentences[0] : '';
            });
            setProjectsArray([...tempProjects]);
            const screenshotArray = Array.from(document.querySelectorAll('.screenshot'));
            screenshotArray.map(e => observer.observe(e));
        }
    }, [projectsFixArray])
    

  return (
    <main className="seipra-page">
        <a className="logo-seipra" href="https://www.seiprascore.com/" target="_blank" rel="noreferrer">
            <img src={seipra} alt="Seipra-Score" />
        </a>
        <h1>Projets pour Seipra Score : HTML, CSS, JavaScript, SQL</h1>
        <section className="screenshots-container">
            <div className="screenshot left">
                <div className="screenshot__img">
                    <img src={projectsArray[0].image} alt="Bayonne bus" />
                </div>
                <div className="screenshot__txt"><p>{projectsArray[0].sentence}</p></div>
            </div>
            <div className="screenshot long">
                <div className="screenshot__img">
                    <img src={projectsArray[1].image} alt="Bayonne Biv TFT" />
                </div>
                <div className="screenshot__txt">
                    <p>{projectsArray[1].sentence}</p>
                </div>
            </div>
            <div className="screenshot  long">
                <div className="screenshot__img">
                    <img src={projectsArray[2].image} alt="Teleo" />
                </div>
                <div className="screenshot__txt">
                    <p>{projectsArray[2].sentence}</p>
                </div>
            </div>
            <div className="screenshot">
                <div className="screenshot__img">
                    <img src={projectsArray[3].image} alt="Salles des billets" />
                </div>
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
            </div>
            <div className="screenshot left long">
                <div className="screenshot__img">
                    <img src={projectsArray[4].image} alt="Teleo meteo" />
                </div>
                <div className="screenshot__txt">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem sunt, quisquam quis, ex sint eius dignissimos sed saepe harum necessitatibus ea veritatis possimus quod.</p>
                </div>
            </div>
        </section>
    </main>
  )
}
