import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useState, useRef, useEffect } from "react"; // Import necessary hooks from react
import { BASE } from "../../common/constants";

export default function AdminPanelDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLinkClick = () => {
    setOpen(false); // Close the dropdown
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        tabIndex="0"
        onClick={() => setOpen(!open)} // Toggle the dropdown
      >
        Admin Panel
      </button>
      {open && (
        <ul
          tabIndex="0"
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link
              className="dropdown-item"
              to={`${BASE}user-search`}
              onClick={handleLinkClick}
            >
              Users searcher
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item"
              to={`${BASE}events`}
              onClick={handleLinkClick}
            >
              View All Events
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
