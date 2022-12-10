import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IMC() {
    const [height, setHeight] = useState(100);
    const [weight, setWeight] = useState(10);
    const [imc, setImc] = useState(0);
    const [answer, setAnswer] = useState('En attente du résultat ...');
    const [BMIObject, setBMIObject] = useState({});

    const BMIData = [
        { name: "Maigreur", color: "midnightblue", range: [0, 18.5] },
        { name: "Bonne santé", color: "green", range: [18.5, 25] },
        { name: "Surpoids", color: "lightcoral", range: [25, 30] },
        { name: "Obésité modérée", color: "orange", range: [30, 35] },
        { name: "Obésité sévère", color: "crimson", range: [35, 40] },
        { name: "Obésité morbide", color: "purple", range: 40 },
    ];

    document.querySelector('.button-container').classList.add('hide');

    const calculateImc = () => {
        if (height && weight && height > 100 && height < 250 && weight > 20 && weight < 250) {
          setImc(Math.round((weight / ((height/100) ** 2))*10) / 10);
        } else {
          setAnswer("remplissez correctement tous les champs");
        }
    }

    useEffect(() => {
        if (imc) {
            const BMI = BMIData.filter(e => e.range[0] < imc);
            imc > 40 ? setBMIObject({...BMIData[5]}) : setBMIObject({...BMI[BMI.length - 1]});
        }
    }, [imc])
    
    useEffect(() => {
        BMIObject !== {} && (BMIObject.name === 'Bonne santé' ? setAnswer('Vous êtes en bonne santé') : setAnswer(`Attention : ${BMIObject.name}`));
    }, [BMIObject])
    

  return (
    <main className="imc-page">
        <div className="imc-page__container">
            <h1>Calcul <span>d'IMC</span></h1>
            <form>
                <div className="sections">
                <label htmlFor="height">Votre taille en centimètres</label>
                <input type="number" id="height" onInput={e => setHeight(e.target.value)} value={height} />
                </div>
                <div className="sections">
                <label htmlFor="weight">Votre masse en Kg</label>
                <input type="number" id="weight" onInput={e => setWeight(e.target.value)} value={weight} />
                </div>
            </form>
            <button className="submit" onClick={calculateImc}>Calculer un <span>IMC</span></button>
            <h3 style={{color: BMIObject ? BMIObject.color : 'black'}}>{imc}</h3>
            <p>{answer}</p>
        </div>
        <Link to="/MaulaveStephane/Projects">
            <button className="previous-page"></button>
        </Link>
    </main>
  )
}
