import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Home from "./composants/Home";
import SoundEngineer from "./composants/IngeSon";
import RadioEngineer from "./composants/RadioEngineer";
import { updateGeneralParams } from "./redux";

export default function App() {
  const dark = useSelector(state => state.generalParams.darkMode);
  const dispatch = useDispatch();

  const switchMode = () => {
    dispatch(updateGeneralParams({darkMode:!dark}));
  }

  return (
    <div className={dark ? "App dark" : "App"}>
      <div className="button-container">
        <button className="switch-button" onClick={switchMode}></button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/soundEngineer" element={<SoundEngineer />} />
        <Route path="/radioEngineer" element={<RadioEngineer />} />
      </Routes>
    </div>
  );
}

