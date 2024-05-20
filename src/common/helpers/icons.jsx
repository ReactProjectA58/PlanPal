import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faAddressCard,
  faBars,
  faListCheck,
  faMagnifyingGlass,
  faPhone,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GithubIcon = () => {
  return <FontAwesomeIcon icon={faGithub} size="2x" />;
};

export const GithubIssues = () => {
  return <FontAwesomeIcon icon={faListCheck} size="2x" />;
};

export const AboutUs = () => {
  return <FontAwesomeIcon icon={faAddressCard} size="2x" />;
};

export const ContactUs = () => {
  return <FontAwesomeIcon icon={faPhone} size="2x" />;
};

export const MagnGlass = () => {
  return <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600" />;
};

export const Burger = () => {
  return (
    <FontAwesomeIcon
      icon={faBars}
      className="swap-off fill-current [:checked~*_&]:!-rotate-45 [:checked~*_&]:!opacity-0"
      style={{ width: "24px", height: "24px" }}
    />
  );
};

export const CancelBurger = () => {
  return (
    <FontAwesomeIcon
      icon={faTimes}
      className="swap-on fill-current [:checked~*_&]:!rotate-0 [:checked~*_&]:!opacity-100"
      style={{ width: "24px", height: "24px" }}
    />
  );
};
