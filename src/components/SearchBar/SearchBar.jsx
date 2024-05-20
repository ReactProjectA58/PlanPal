import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({ onSearch, clearSearch, currentView }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchQuery("");
  }, [clearSearch, currentView]);

  return (
    <div className="relative flex items-center max-w-md shadow-lg rounded-lg mr-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-600" />
      </div>
      <input
        type="text"
        className="pl-10 pr-3 py-2 rounded-l-lg border border-transparent  focus:outline-none w-full"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={handleKeyPress}
      />

      <button className="btn btn-ghost" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  clearSearch: PropTypes.bool,
  currentView: PropTypes.string,
};
