import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default function Quizz() {
  const [responsesArray, setResponsesArray] = useState([]);
  const [resultResponse, setResultResponse] = useState('Cliquez sur valider pour vérifier vos réponses');
  const [total, setTotal] = useState('');
  const [classesArray, setClassesArray] = useState([]);

  const emojis = ["✅", "✨", "👀", "😭", "👎"];

  const questionsArray = [
      {
          question: "Qui est sacré Empereur de France le 2 décembre 1804 ?",
          responses: [
              "Clovis",
              "Abraham Lincoln",
              "Napoléon Bonaparte"
          ],
          goodAnswer: 2
      },
      {
          question: "Quand la déclaration d'indépendance des Etats-Unis a-t-elle été votée ?",
          responses: [
              "4 juillet 1776",
              "18 avril 1856",
              "30 juin 1925"
          ],
          goodAnswer: 0
      },
      {
          question: "Quand a eu lieu la chute de l'empire romain d'occident ?",
          responses: [
              "15 ap. J-C",
              "476 ap. J-C",
              "740 av. J-C"
          ],
          goodAnswer: 1
      },
      {
          question: "Quelle est la capitale de la Slovénie ?",
          responses: [
              "Ljubljana",
              "Belgrade",
              "Bratislava"
          ],
          goodAnswer: 0
      },
      {
          question: "Combien d'habitants compte l'Irlande en 2020 ?",
          responses: [
              "1,365 M",
              "21 M",
              "4,9 M"
          ],
          goodAnswer: 2
      }
    ]

  useEffect(() => {
    const array = questionsArray.map(e => 9);
    !responsesArray.length && setResponsesArray([...array]);
  }, questionsArray)
    
    const QuestionCard = props => {
      const checkResponse = (ind,e) => {
        const responseTempArray =[...responsesArray];
        if (e.target.checked) {
          responseTempArray.splice(props.questionIndex,1,ind);
          setResponsesArray([...responseTempArray]);
        }
      }
      return (
        <div className={classesArray.length ? classesArray[props.questionIndex] : "question-container"}>
          <h3>{props.question.question}</h3>
          <fieldset className="response-container">
            <h4>{responsesArray[props.index]}</h4>
            <div className="single-response">
              <input type="radio" name={`response${props.questionIndex}`} id={`response${props.questionIndex}check1`} onChange={e => checkResponse(0,e)} checked={responsesArray[props.questionIndex] === 0}  />
              <label htmlFor={`response${props.questionIndex}check1`}>{props.question.responses[0]}</label>
            </div>
            <div className="single-response">
              <input type="radio" name={`response${props.questionIndex}`} id={`response${props.questionIndex}check2`} onChange={e => checkResponse(1,e)} checked={responsesArray[props.questionIndex] === 1} />
              <label htmlFor={`response${props.questionIndex}check2`}>{props.question.responses[1]}</label>
            </div>
            <div className="single-response">
              <input type="radio" name={`response${props.questionIndex}`} id={`response${props.questionIndex}check3`} onChange={e => checkResponse(2,e)} checked={responsesArray[props.questionIndex] === 2} />
              <label htmlFor={`response${props.questionIndex}check3`}>{props.question.responses[2]}</label>
            </div>
          </fieldset>
        </div>
      )
    }

    const responseDisplay = totalResponses => {
      switch (totalResponses) {
        case 0:
          setResultResponse('Vous avez totalement raté !');
          break;
        case 1:
          setResultResponse('Pas terrible du tout.');
          break;
        case 2:
          setResultResponse('Encore un petit effort !');
          break;
        case 3:
          setResultResponse('Pas trop mal...');
          break;
        case 4:
          setResultResponse('Bien ! Une seule faute, vous pouvez faire encore mieux.');
          break;
        case 5:
          setResultResponse('Wow !! Parfait... Maîtrise totale');
          break;
      }
    }

    const checkResponses = () => {
      if (responsesArray.some(e => e === 9)) {
        setResultResponse('Répondez à toutes les questions') 
      } else {
        const allResponsesArray = questionsArray.map(e => e.goodAnswer);
        let totalResponses = 0;
        const array = [];
        responsesArray.map((e,index) => {
          e == allResponsesArray[index] && totalResponses++;
          setTotal(totalResponses);
          array.push(e == allResponsesArray[index] ? 'question-container good' : 'question-container false');
        })
        responseDisplay(totalResponses);
        setClassesArray([...array]);
      }
    }
    
  return (
    <main className="quizz-page">
      <div className="quizz-page__container">
        <header className="title-container">
          <h1>Quizz</h1>
          <h2>Culture générale ☑️</h2>
          <div className="title-icon"></div>
        </header>
        <section className="questions-container">
          {questionsArray.map((question,index) => <QuestionCard key={uuidv4()} question={question} questionIndex={index} />)}
        </section>
        <button type="submit" onClick={checkResponses}><p>VALIDER</p></button>
        <footer>
          <p>{resultResponse}</p>
          {total !== '' && <p>Score : <span>{total}/5</span></p>}
          <p>{(total && total < 5) ? 'Vous pouvez retenter votre chance' : ''}</p>
        </footer>
      </div>
      <Link to="/Projects">
            <button className="previous-page"></button>
      </Link>
    </main>
  )
}
