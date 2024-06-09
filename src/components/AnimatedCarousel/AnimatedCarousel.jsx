import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./AnimatedCarousel.css";

const images = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    url: "https://react.dev/",
  },
  {
    src: "https://seeklogo.com/images/G/greensock-gsap-icon-logo-13BB451E88-seeklogo.com.png",
    url: "https://gsap.com/",
  },
  {
    src: "https://www.svgrepo.com/show/333609/tailwind-css.svg",
    url: "https://tailwindcss.com/",
  },
  {
    src: "https://raw.githubusercontent.com/saadeghi/daisyui-images/master/images/daisyui-logo/favicon-192.png",
    url: "https://daisyui.com/",
  },
  {
    src: "https://www.svgrepo.com/show/353735/firebase.svg",
    url: "https://firebase.google.com/",
  },

  {
    src: "https://www.svgrepo.com/show/303206/javascript-logo.svg",
    url: "https://www.w3schools.com/js/",
  },
];

const AnimatedCarousel = () => {
  const carouselLineRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "linear" } });
    tl.to(carouselLineRef.current, { xPercent: -50, duration: 60 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="carousel-container">
      <div className="carousel-line" ref={carouselLineRef}>
        {images.concat(images).map((image, index) => (
          <div
            className="carousel-image"
            key={index}
            style={{ backgroundImage: `url(${image.src})` }}
            onClick={() => window.open(image.url, "_blank")}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default AnimatedCarousel;
