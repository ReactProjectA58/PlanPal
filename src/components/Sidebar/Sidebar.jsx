import { Burger, CancelBurger } from "../../common/helpers/icons";

export default function SideBar() {
  return (
    <div className="drawer z-50 w-max">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <label
        className="btn btn-circle swap swap-rotate z-10 relative  "
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
            <a href="/dashboard">Dashboard</a>
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
