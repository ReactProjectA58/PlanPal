import { useNavigate } from "react-router-dom";
import { Burger, CancelBurger } from "../../common/helpers/icons";
import { BASE } from "../../common/constants";

export default function SideBar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    document.getElementById("my-drawer").checked = false; // Close the drawer
  };

  return (
    <div className="drawer w-max z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <label
        className="btn btn-circle swap swap-rotate z-10 relative"
        htmlFor="my-drawer"
      >
        <Burger />
        <CancelBurger />
      </label>

      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <br />
          <br />
          <br />

          <li>
            <button
              onClick={() => handleNavigation(`${BASE}calendar`)}
              className="btn flex justify-start"
            >
              Calendar
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`${BASE}events`)}
              className="btn flex justify-start"
            >
              Events
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`${BASE}contacts`)}
              className="btn flex justify-start"
            >
              Contacts
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`${BASE}about`)}
              className="btn flex justify-start"
            >
              About us
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
