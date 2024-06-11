import { useRef } from "react";
import gsap from "gsap";
import Kaloyan from "../../assets/me.png";
import Milen from "../../assets/Milen.png";
// import Yordan from "../../assets/me3.png";
import "./AnimatedCard.css";
import { useGSAP } from "@gsap/react";
import AnimatedCarousel from "../AnimatedCarousel/AnimatedCarousel";
import { GithubIcon, LinkedInIcon } from "../../common/helpers/icons";

const cardData = [
  {
    profilePic: Kaloyan,
    description:
      "I'm an enthusiastic junior developer specializing in JavaScript and React. I enjoy creating dynamic web applications and strive to deliver high-quality solutions.",

    name: "Kaloyan Kostov",
    title: "Junior Frontend Developer",
    linkedin: "https://www.linkedin.com/in/kaloyan-kostov-82b04926a/",
    github: "https://github.com/kkkostov",
  },
  {
    profilePic: Milen,
    description:
      "I'm a passionate junior developer focused on JavaScript and React. I love building interactive web applications and aim to provide top-notch solutions.",
    name: "Milen Donev",
    title: "Junior Frontend Developer",
    linkedin: "https://www.linkedin.com/in/milen-donev-00b031227/",
    github: "https://github.com/MilenDonevv",
  },
  {
    // profilePic: Yordan,
    description:
      "I'm an enthusiastic junior developer specializing in JavaScript and React. I enjoy creating dynamic web applications and strive to deliver high-quality solutions.",
    name: "Yordan Dimitrov",
    title: "Junior Frontend Developer",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },
];

const AnimatedCard = () => {
  const cardsRef = useRef([]);

  useGSAP(() => {
    cardsRef.current.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const mouseX = -(window.innerWidth / 2 - event.pageX) / 30;
        const mouseY = (window.innerHeight / 2 - event.pageY) / 10;

        gsap.to(card, {
          duration: 0.5,
          rotationY: mouseX,
          rotationX: mouseY,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          duration: 0.5,
          rotationY: 0,
          rotationX: 0,
          ease: "power2.out",
        });
      });
    });
  }, []);

  return (
    <div className="profile-card-container">
      {cardData.map((data, index) => (
        <div className="perspective" key={index}>
          <div className="card" ref={(el) => (cardsRef.current[index] = el)}>
            <div>
              <AnimatedCarousel />
            </div>

            <p className="description">{data.description}</p>
            <div
              className="thumb"
              style={{ backgroundImage: `url(${data.profilePic})` }}
            ></div>

            <div className="social-icons flex gap-2">
              <a href={data.linkedin} target="_blank">
                <LinkedInIcon />
              </a>
              <a href={data.github} target="_blank">
                <GithubIcon />
              </a>
            </div>

            <div className="text-container">
              <h2>{data.name}</h2>
              <span>{data.title}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedCard;
