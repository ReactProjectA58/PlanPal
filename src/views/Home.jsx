import LogoZoom from "../components/AnimatedLogo/AnimatedLogo";
import AnimatedStack from "../components/AnimatedStack/AnimatedStack";
import TopThreeEvents from "../components/Events/TopEvents";

export default function Home() {
  return (
    <>
      <div className="spacer"></div>
      <LogoZoom />
      <AnimatedStack />
      <TopThreeEvents />
    </>
  );
}
