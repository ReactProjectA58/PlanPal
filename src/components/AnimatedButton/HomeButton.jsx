import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AnimatedButton.css";
import { BASE } from "../../common/constants";

function HomeButton() {
  const navigate = useNavigate();

  useEffect(() => {
    const rippleBtn = document.getElementById("home-ripple");
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

  const handleClick = () => {
    navigate(`${BASE}dashboard`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className="btn btn--ripple btn-primary"
      id="home-ripple"
      onClick={handleClick}
    >
      PlanPal
    </button>
  );
}

export default HomeButton;
