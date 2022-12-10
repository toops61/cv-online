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

export default function App() {
  const dark = useSelector(state => state.generalParams.darkMode);
  const dispatch = useDispatch();

  const switchMode = () => {
    dispatch(updateGeneralParams({darkMode:!dark}));
  }

  return (
    <div className={dark ? "App dark" : "App"}>
      <Link className="back" to="/MaulaveStephane/"></Link>
      <div className="button-container">
        <button className="switch-button" onClick={switchMode}></button>
      </div>
      <Routes>
        <Route path="/MaulaveStephane/" element={<Home />} />
        <Route path="/MaulaveStephane/soundEngineer" element={<SoundEngineer />} />
        <Route path="/MaulaveStephane/radioEngineer" element={<RadioEngineer />} />
        <Route path="/MaulaveStephane/projects" element={<Projects />} />
        <Route path="/MaulaveStephane/Imc" element={<Imc />} />
        <Route path="/MaulaveStephane/Quizz" element={<Quizz />} />
        <Route path="/MaulaveStephane/WikiApp" element={<WikiApp />} />
        <Route path="/MaulaveStephane/Cookies" element={<Cookies />} />
        <Route path="/MaulaveStephane/AppMeteo" element={<AppMeteo />} />
        <Route path="/MaulaveStephane/CouleursJS" element={<CouleursJS />} />
        <Route path="/MaulaveStephane/Pomodoro" element={<Pomodoro />} />
        <Route path="/MaulaveStephane/Formulaire" element={<Formulaire />} />
        <Route path="/MaulaveStephane/Memory" element={<Memory />} />
        <Route path="/MaulaveStephane/Scroll" element={<Scroll />} />
        <Route path="/MaulaveStephane/Slider" element={<Slider />} />
        <Route path="/MaulaveStephane/Password" element={<Password />} />
        <Route path="/MaulaveStephane/Filter" element={<Filter />} />
        <Route path="/MaulaveStephane/VideoPlayer" element={<VideoPlayer />} />
        <Route path="/MaulaveStephane/Morpion" element={<Morpion />} />
        <Route path="/MaulaveStephane/Particules" element={<Particules />} />
        <Route path="/MaulaveStephane/Animate" element={<Animate />} />
        <Route path="/MaulaveStephane/Typing" element={<Typing />} />
        <Route path="/MaulaveStephane/Calculator" element={<Calculator />} />
        <Route path="/MaulaveStephane/AudioPlayer" element={<AudioPlayer />} />
      </Routes>
    </div>
  );
}

