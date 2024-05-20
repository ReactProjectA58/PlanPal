import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faInfoCircle,
  faListCheck,
  faAddressCard,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-white py-4">
      <footer className="footer bg-base-300 text-base-content fixed bottom-0 p-5 flex justify-around">
        <nav>
          <h6 className=" font-semibold text-gray-600 uppercase ">Team 03</h6>
          <div className="grid grid-flow-col gap-4 mt-1">
            <a href="/contact-us">
              <FontAwesomeIcon icon={faPhone} size="2x" />
            </a>
            <a href="/about">
              <FontAwesomeIcon icon={faAddressCard} size="2x" />
            </a>
          </div>
        </nav>
        <nav>
          <h6 className="font-semibold text-gray-600 uppercase ">Project</h6>
          <div className="grid grid-flow-col gap-4 mt-1">
            <a href="https://github.com/ReactProjectA58/PlanPal">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a href="https://github.com/orgs/ReactProjectA58/projects/1">
              <FontAwesomeIcon icon={faListCheck} size="2x" />
            </a>
          </div>
        </nav>
      </footer>
    </footer>
  );
}
