import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateGeneralParams } from "../../redux";

export default function Particules() {
  document.querySelector(".button-container")?.classList.add("hide");

  const dispatch = useDispatch();

  const [particulesArray, setParticulesArray] = useState([]);

  useEffect(() => {
    dispatch(updateGeneralParams({ darkMode: true }));
    const canvas = getDimensions();
    const ctx = canvas.getContext('2d');
    createParticules(ctx);
  }, [])
  
  const canvasRef = useRef(null);

  const getDimensions = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas
  }
  
  window.addEventListener('resize',getDimensions);

  const createParticules = ctx => {
    const tempArray = [...particulesArray];
    const number = (window.innerWidth * window.innerHeight) / 7000;
    for (let i = 0; i < number; i++) {
        const x = Math.random()*(window.innerWidth - 20) + 10;
        const y = Math.random()*(window.innerHeight - 20) + 10;
        const directionX = randomDirection();
        const directionY = randomDirection();
        const particule = {
          ctx:ctx,
          x:x,
          y:y,
          directionX:directionX,
          directionY:directionY,
          size:1.5,
          color:'rgb(255,255,255)'
        }
        drawParticule(particule);
        tempArray.push(particule);
    }
    setParticulesArray([...tempArray]);
  }

  const randomDirection = () => {
      const randomBoolean = Math.round(Math.random());
      return randomBoolean ? Math.random() : - Math.random();
  }

  const drawParticule = particule => {
    const ctx = particule.ctx;
    ctx.fillStyle = particule.color;
    ctx.beginPath();
    ctx.arc(particule.x,particule.y,particule.size,0,Math.PI*2);
    ctx.fill();
  }

  const moveParticule = (particule) => {
    (particule.x > window.innerWidth || particule.x < 0) && (particule.directionX = -particule.directionX);
    (particule.y > window.innerHeight || particule.y < 0) && (particule.directionY = -particule.directionY);
    particule.x += particule.directionX;
    particule.y += particule.directionY;
    drawParticule(particule);
    return particule;
  }

  const joinParticules = () => {
      particulesArray.map(e => {
          particulesArray.map(el => {
              const a = e.x - el.x;
              const b = e.y - el.y;
              const hypothenuse = Math.sqrt(a**2 + b**2);
              if (hypothenuse < 95 && e !== el) {
                  e.ctx.moveTo(e.x, e.y);
                  e.ctx.lineTo(el.x, el.y);
                  e.ctx.stroke();
                  e.ctx.strokeStyle = `rgba(255,255,255,${1-(hypothenuse / 115)})`;
                  e.ctx.lineWidth = 0.02;
              }
          });
      })
  }

  const animateParticules = () => {
    const ctx = particulesArray[0].ctx;
    setTimeout(() => {
      ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      const tempArray = particulesArray.map(e => moveParticule(e));
      setParticulesArray([...tempArray]);
      joinParticules();
    }, 15);
  }

  useEffect(() => {
    if (particulesArray.length) {
      const animationFrameId = window.requestAnimationFrame(animateParticules);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      }
    }
  }, [particulesArray])
  

  return (
    <main className="particules-page">
      <canvas ref={canvasRef}>
        Désolé, votre navigateur ne prend pas en charge &lt;canvas&gt;.
      </canvas>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </main>
  )
}
