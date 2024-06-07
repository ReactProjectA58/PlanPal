import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./AnimatedStack.css";

function AnimatedStack() {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    const cards = document.querySelectorAll(".custom-card");
    const height = 500;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".cards",
        pin: true,
        scrub: 1,
        start: "69%",
        end: "130% ",
        // markers: true,
      },
    });

    timeline.from(".custom-card", {
      y: (index) => height * (cards.length - (index + 1)),
      duration: (index) => 0.6 / (index + 1),
      ease: "none",
      stagger: (index) => 0.3 * index,
    });
  });

  return (
    <>
      <div className="container">
        <div className="cards">
          <div className="custom-card card1" style={{ zIndex: 4 }}>
            <div className="card-content">
              <h1>Plan and Discover</h1>
              <p>
                {" "}
                Manage your schedule with PlanPal's interactive calendar. Check
                your events at a glance, explore new opportunities, and stay
                organized.
              </p>
            </div>
            <div className="card-image">
              <img
                src="https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg"
                alt="Card 1"
              />
            </div>
          </div>

          <div className="custom-card card2" style={{ zIndex: 3 }}>
            <div className="card-content">
              <h1>Organize</h1>
              <p>
                {" "}
                Easily create public or private events with our intuitive
                interface. Manage your events by adding, removing, or editing
                details effortlessly. Specify locations and keep your attendees
                informed with real-time updates.
              </p>
            </div>
            <div className="card-image">
              <img
                src="https://images.pexels.com/photos/3321793/pexels-photo-3321793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Card 2"
              />
            </div>
          </div>

          <div className="custom-card card3" style={{ zIndex: 2 }}>
            <div className="card-content">
              <h1>Connect and Share</h1>
              <p>
                {" "}
                Effortlessly manage your contacts with PlanPal. Ensure the right
                people are always informed and collaborate seamlessly. Keep your
                network updated and engaged with all your event details.
              </p>
            </div>
            <div className="card-image">
              <img
                src="https://images.pexels.com/photos/7188821/pexels-photo-7188821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Card 3"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div style={{ height: "450px" }}></div>
        </div>
      </div>
    </>
  );
}
export default AnimatedStack;
