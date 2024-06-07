import React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Logo from "../../assets/PlanPalLogo.svg";

gsap.registerPlugin(ScrollTrigger);

const LogoZoom = () => {
  useGSAP(() => {
    const setupLogoAnimations = () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === "#logo-trigger") {
          trigger.kill();
        }
      });

      const tl = gsap.timeline({ paused: true });
      tl.to("#text-svg", {
        opacity: 0,
        scale: 7,
        duration: 1.0,
      });

      ScrollTrigger.create({
        trigger: "#logo-trigger",
        start: "50% 44%",
        end: "100% 10%",
        scrub: 1,
        pin: true,
        animation: tl,
        // markers: true,
      });
    };

    setupLogoAnimations();
    window.addEventListener("resize", setupLogoAnimations);

    return () => {
      window.removeEventListener("resize", setupLogoAnimations);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === "#logo-trigger") {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div
      id="logo-trigger"
      className="container panel"
      style={{ overflow: "revert-layer" }}
    >
      <h1 id="text-svg">
        <img
          src={Logo}
          style={{
            display: "flex",
            width: "35%",
            margin: "auto",
            zIndex: "999",
            // paddingTop: "250px",
          }}
        />
      </h1>
    </div>
  );
};

export default LogoZoom;
