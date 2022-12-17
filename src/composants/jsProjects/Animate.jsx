import { Link } from "react-router-dom";
import downArrow from "../../assets/ressourcesAnimation/down-arrow.svg";
import rightChevron from "../../assets/ressourcesAnimation/right-chevron.svg";
import verticalPorsche from "../../assets/ressourcesAnimation/vertical-porsche.jpg";
import sideOne from "../../assets/ressourcesAnimation/side-1.jpg";
import sideTwo from "../../assets/ressourcesAnimation/side-2.jpg";
import sideThree from "../../assets/ressourcesAnimation/side-3.jpg";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateGeneralParams } from "../../redux";

export default function Animate() {
  document.querySelector(".button-container")?.classList.add("hide");

  const [titleText, setTitleText] = useState("");
  const [titleVisible, setTitleVisible] = useState(true);
  const [indexTitle, setIndexTitle] = useState(0);

  const dispatch = useDispatch();

  const titleArray = "Porsche, set free.".split("");

  const moveCursor = (e) => {
    const posX = e.pageX - 7;
    const posY = e.pageY - 7;
    document.querySelector(
      ".custom-cursor"
    ).style.transform = `translate(${posX}px,${posY}px)`;
  };

  useEffect(() => {
    const duration = (Math.random() + 0.5) * 500;
    setTimeout(() => {
      if (titleText.length < titleArray.length && titleVisible) {
        setTitleText(titleText + titleArray[indexTitle]);
        setIndexTitle(indexTitle + 1);
      } else {
        setTitleText("");
        setIndexTitle(0);
      }
    }, duration);
  }, [titleText, titleVisible]);

  useEffect(() => {
    window.scrollTo(0,0);
    dispatch(updateGeneralParams({ darkMode: true }));
    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  useEffect(() => {
    if (document.querySelector("h1")) {
      observer.observe(document.querySelector("h1"));
      observer.observe(document.querySelector(".contact-button"));
      const articlesPart2Array = document.querySelectorAll(".article-part2 .picture-part");
      for (let i = 0; i < 3; i++) {
        observer.observe(articlesPart2Array[i]);
      }
    }
  }, [])
  

  const downScreen = () => {
    const scrollHeight = document.querySelector(".top-section").offsetHeight;
    window.scrollTo({ top: scrollHeight, behavior: "smooth" });
  };

  const rootMargin = window.innerWidth > 800 ? "-50px" : "0px";

  const observer = new IntersectionObserver(
    entries => {
      const articlesPart2ImagesArray = document.querySelectorAll(
        ".article-part2 .picture-part"
      );
      const articlesPart2Array = document.querySelectorAll(".article-part2");
      const addAppears = index => articlesPart2Array[index].classList.add("appears");
      const removeAppears = index => articlesPart2Array[index].classList.remove("appears");

      entries.map((e) => {
        switch (e.target) {
          case document.querySelector("h1"):
            setTitleVisible(e.isIntersecting ? true : false);
            break;
          case document.querySelector(".contact-button"):
            if (e.isIntersecting) {
              document
                .querySelector(".scroll-section")
                .classList.add("appears");
              observer.unobserve(e.target);
            }
            break;
          case articlesPart2ImagesArray[0]:
            e.isIntersecting ? addAppears(0) : removeAppears(0);
            break;
          case articlesPart2ImagesArray[1]:
            e.isIntersecting ? addAppears(1) : removeAppears(1);
            break;
          case articlesPart2ImagesArray[2]:
            e.isIntersecting ? addAppears(2) : removeAppears(2);
            break;
          default:
            break;
        }
      });
    },
    {
      rootMargin: rootMargin,
    }
  );

  return (
    <div className="animation-page">
      <main className="main-anim">
        <div className="custom-cursor">
          <p>.</p>
        </div>
        <section className="top-section">
          <nav>
            <ul>
              <li>Home</li>
              <li>Services</li>
              <li>Features</li>
            </ul>
          </nav>
          <h1>{titleText}</h1>
          <p className={titleVisible ? "subtitle appears" : "subtitle"}>Lorem ipsum, dolor sit amet</p>
          <button className="down-button" onClick={downScreen}>
            <img src={downArrow} alt="arrow" />
          </button>
        </section>
        <section className="scroll-section">
          <div className="part1">
            <div className="title-container">
              <h2>
                <span>Feel the</span> road
              </h2>
              <p>Start today</p>
            </div>
            <article className="article-part1">
              <div className="text-part">
                <h3>You've never experienced that.</h3>
                <p className="text">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius
                  necessitatibus, dicta quibusdam mollitia ab neque, nemo illum
                  architecto earum repellat sint deleniti. Quae, a qui,
                  assumenda nobis nisi voluptate numquam magnam consectetur
                  ducimus hic, distinctio iste totam illum. Doloribus ipsum
                  perspiciatis quas aut reiciendis eius mollitia praesentium
                  totam. Impedit optio quia laborum architecto necessitatibus,
                  iure culpa consequuntur vel saepe? Reiciendis fuga, voluptatem
                  tempora iusto fugiat ipsa quasi animi. Eius, repellat.
                </p>
                <button className="contact-button">
                  <p>Contact Us</p>
                  <div className="chevron">
                    <img src={rightChevron} alt="chevron" />
                  </div>
                </button>
              </div>
              <div className="picture-part">
                <img src={verticalPorsche} alt="vertical" />
              </div>
            </article>
          </div>
          <div className="part2">
            <div className="title-container">
              <h2>Browse the models.</h2>
              <p>Pick your favourite.</p>
            </div>
            <article className="article-part2">
              <div className="text-part">
                <h3>Cayman.</h3>
                <p className="text">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Libero vitae aspernatur fuga nihil, labore repudiandae.
                </p>
              </div>
              <div className="picture-part">
                <img src={sideOne} alt="cayman" />
              </div>
            </article>
            <article className="article-part2">
              <div className="picture-part">
                <img src={sideTwo} alt="cayman" />
              </div>
              <div className="text-part">
                <h3>Panamera.</h3>
                <p className="text">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Libero vitae aspernatur fuga nihil, labore repudiandae.
                </p>
              </div>
            </article>
            <article className="article-part2">
              <div className="text-part">
                <h3>The 911.</h3>
                <p className="text">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Libero vitae aspernatur fuga nihil, labore repudiandae.
                </p>
              </div>
              <div className="picture-part">
                <img src={sideThree} alt="cayman" />
              </div>
            </article>
          </div>
        </section>
      </main>
      <Link to="/MaulaveStephane/Projects">
        <button className="previous-page"></button>
      </Link>
    </div>
  );
}
