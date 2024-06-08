import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Kaloyan from "../../assets/me.png";
// import Milen from "../../assets/me2.png";
// import Yordan from "../../assets/me3.png";
import "./AnimatedCard.css";

const cardData = [
  {
    profilePic: Kaloyan,
    description:
      "I'm an enthusiastic junior developer specializing in JavaScript and React. I enjoy creating dynamic web applications and strive to deliver high-quality solutions.",

    name: "Kaloyan Kostov",
    title: "Junior Frontend Developer",
  },
  {
    // profilePic: Milen,
    description:
      "I'm an enthusiastic junior developer specializing in JavaScript and React. I enjoy creating dynamic web applications and strive to deliver high-quality solutions.",
    name: "Milen",
    title: "Junior Frontend Developer",
  },
  {
    // profilePic: Yordan,
    description:
      "I'm an enthusiastic junior developer specializing in JavaScript and React. I enjoy creating dynamic web applications and strive to deliver high-quality solutions.",
    name: "Yordan",
    title: "Junior Frontend Developer",
  },
];

const AnimatedCard = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
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
            <div className="quote-icon">@</div>
            <p className="description">{data.description}</p>
            <div
              className="thumb"
              style={{ backgroundImage: `url(${data.profilePic})` }}
            ></div>
            <div className="text-container">
              <h2>{data.name}</h2>
              <span>{data.title}</span>
            </div>
            <div className="social-icons"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedCard;
