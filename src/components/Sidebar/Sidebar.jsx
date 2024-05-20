import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <label
        className="btn btn-circle swap swap-rotate z-10"
        htmlFor="my-drawer"
        style={{ position: "relative", bottom: "135%", left: "35%" }}
      >
        <FontAwesomeIcon
          icon={faBars}
          className="swap-off fill-current [:checked~*_&]:!-rotate-45 [:checked~*_&]:!opacity-0"
          style={{ width: "24px", height: "24px" }}
        />
        <FontAwesomeIcon
          icon={faTimes}
          className="swap-on fill-current [:checked~*_&]:!rotate-0 [:checked~*_&]:!opacity-100"
          style={{ width: "24px", height: "24px" }}
        />
      </label>

      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content  ">
          <br />
          <br />
          <br />
          <li>
            <a>Dashboard</a>
          </li>
          <li>
            <a>Events</a>
          </li>
          <li>
            <a href="/contacts">Contacts</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
