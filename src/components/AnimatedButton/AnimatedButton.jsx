import React from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import "./AnimatedButton.css";

function AnimatedButton() {
  const navigate = useNavigate();

  useGSAP(() => {
    const rippleBtn = document.getElementById("ripple");
    let ripples = document.createElement("span");
    let cleartimeout;

    const handleMouseOver = (e) => {
      let x = e.clientX - e.target.offsetLeft;
      let y = e.clientY - e.target.offsetTop;
      ripples.style.left = x + "px";
      ripples.style.top = y + "px";
      rippleBtn.appendChild(ripples);

      cleartimeout = setTimeout(() => {
        ripples.remove();
      }, 1000);
    };

    const handleMouseOut = () => {
      ripples.remove();
      clearTimeout(cleartimeout);
    };

    rippleBtn.addEventListener("mouseover", handleMouseOver);
    rippleBtn.addEventListener("mouseout", handleMouseOut);

    return () => {
      rippleBtn.removeEventListener("mouseover", handleMouseOver);
      rippleBtn.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div className="btn-container">
      <button
        className="btn btn--hoverEffect2"
        onClick={() => navigate("/register")}
      >
        Join us
      </button>
      <button
        className="btn btn--ripple btn-primary"
        id="ripple"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}

export default AnimatedButton;
