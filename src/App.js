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

export default function App() {
  const dark = useSelector(state => state.generalParams.darkMode);
  const dispatch = useDispatch();

  const switchMode = () => {
    dispatch(updateGeneralParams({darkMode:!dark}));
  }

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
        <Route path="/projects" element={<Projects />} />
        <Route path="/Imc" element={<Imc />} />
        <Route path="/Quizz" element={<Quizz />} />
        <Route path="/WikiApp" element={<WikiApp />} />
        <Route path="/Cookies" element={<Cookies />} />
        <Route path="/AppMeteo" element={<AppMeteo />} />
        <Route path="/CouleursJS" element={<CouleursJS />} />
        <Route path="/Pomodoro" element={<Pomodoro />} />
        <Route path="/Formulaire" element={<Formulaire />} />
        <Route path="/Memory" element={<Imc />} />
        <Route path="/Scroll" element={<Imc />} />
        <Route path="/Slider" element={<Imc />} />
        <Route path="/Password" element={<Quizz />} />
        <Route path="/Filter" element={<Imc />} />
        <Route path="/VideoPlayer" element={<Imc />} />
        <Route path="/Morpion" element={<Imc />} />
        <Route path="/Particules" element={<Imc />} />
        <Route path="/Animate" element={<Imc />} />
        <Route path="/Typing" element={<Imc />} />
        <Route path="/Calculator" element={<Imc />} />
        <Route path="/AudioPlayer" element={<Imc />} />
      </Routes>
    </div>
  );
}

