import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./composants/Home";
import SoundEngineer from "./composants/SoundEngineer";
import RadioEngineer from "./composants/RadioEngineer";
import { updateGeneralParams } from "./redux";
import Projects from "./composants/Projects";
import Imc from "./composants/jsProjects/Imc";
import Quizz from "./composants/jsProjects/Quizz";
import WikiApp from "./composants/jsProjects/WikiApp";
import Cookies from "./composants/jsProjects/Cookies";
import AppMeteo from "./composants/jsProjects/AppMeteo";
import CouleursJS from "./composants/jsProjects/CouleursJS";
import Formulaire from "./composants/jsProjects/Formulaire";
import Pomodoro from "./composants/jsProjects/Pomodoro";
import Memory from "./composants/jsProjects/Memory";
import Scroll from "./composants/jsProjects/Scroll";
import Slider from "./composants/jsProjects/Slider";
import Password from "./composants/jsProjects/Password";
import Filter from "./composants/jsProjects/Filter";
import VideoPlayer from "./composants/jsProjects/VideoPlayer";
import Morpion from "./composants/jsProjects/Morpion";
import Particules from "./composants/jsProjects/Particules";
import Animate from "./composants/jsProjects/Animate";
import Typing from "./composants/jsProjects/Typing";
import Calculator from "./composants/jsProjects/Calculator";
import AudioPlayer from "./composants/jsProjects/AudioPlayer";
import PrimeNumbers from "./composants/otherProjects/PrimeNumbers";
import NasaPictures from "./composants/otherProjects/NasaPictures";
import Converter from "./composants/otherProjects/Converter";
import Seipra from "./composants/Seipra";
import { useEffect } from "react";

export default function App() {
  const dark = useSelector(state => state.generalParams.darkMode);
  const dispatch = useDispatch();

  const switchMode = () => {
    dispatch(updateGeneralParams({darkMode:!dark}));
  }

  const changeBodySize = () => {
    window.innerWidth < 900 ? document.querySelector('body').style.height = window.innerHeight + 'px' : document.querySelector('body').style = '';
  }

  useEffect(() => {
    window.addEventListener('resize', changeBodySize);
    changeBodySize();
  }, []);

  return (
    <div className={dark ? "App dark" : "App"}>
      <Link className="back" to="/"></Link>
      <div className="button-container">
        <button className="switch-button" onClick={switchMode}></button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/soundEngineer" element={<SoundEngineer />} />
        <Route path="/radioEngineer" element={<RadioEngineer />} />
        <Route path="/seipra" element={<Seipra />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/Imc" element={<Imc />} />
        <Route path="/Quizz" element={<Quizz />} />
        <Route path="/WikiApp" element={<WikiApp />} />
        <Route path="/Cookies" element={<Cookies />} />
        <Route path="/AppMeteo" element={<AppMeteo />} />
        <Route path="/CouleursJS" element={<CouleursJS />} />
        <Route path="/Pomodoro" element={<Pomodoro />} />
        <Route path="/Formulaire" element={<Formulaire />} />
        <Route path="/Memory" element={<Memory />} />
        <Route path="/Scroll" element={<Scroll />} />
        <Route path="/Slider" element={<Slider />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/Filter" element={<Filter />} />
        <Route path="/VideoPlayer" element={<VideoPlayer />} />
        <Route path="/Morpion" element={<Morpion />} />
        <Route path="/Particules" element={<Particules />} />
        <Route path="/Animate" element={<Animate />} />
        <Route path="/Typing" element={<Typing />} />
        <Route path="/Calculator" element={<Calculator />} />
        <Route path="/AudioPlayer" element={<AudioPlayer />} />
        <Route path="/Prime" element={<PrimeNumbers />} />
        <Route path="/Nasa" element={<NasaPictures />} />
        <Route path="/Converter" element={<Converter />} />
      </Routes>
    </div>
  );
}

