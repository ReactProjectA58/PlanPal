import { Burger, CancelBurger } from "../../common/helpers/icons";

export default function SideBar() {
  return (
    <div className="drawer z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <label
        className="btn btn-circle swap swap-rotate z-10 relative bottom-14 left-3"
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
