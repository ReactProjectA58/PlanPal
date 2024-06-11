import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function AdminPanelDropdown() {
  return (
    <div className="dropdown dropdown-end">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        tabIndex="0"
      >
        Admin Panel
      </button>
      <ul
        tabIndex="0"
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <Link className="dropdown-item" to="/user-search">
            Users searcher
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/events">
            View All Events
          </Link>
        </li>
      </ul>
    </div>
  );
}
