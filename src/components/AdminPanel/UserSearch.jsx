import { useState, useEffect } from "react";
import { searchUsers } from "../../services/admin.service";
import SearchedUser from "./SearchedUser.jsx";
import PropTypes from "prop-types";

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const allUsers = await searchUsers("");
      setUsers(allUsers);
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim() !== "") {
        const results = await searchUsers(searchTerm);
        setSearchResults(results);
        setSearchPerformed(true);
      } else {
        setSearchResults(users);
        setSearchPerformed(false);
      }
    };

    performSearch();
  }, [searchTerm, users]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for user..."
        style={{
          borderStyle: "inset",
          borderWidth: "2px",
          borderColor: "green",
          backgroundColor: "white",
          color: "black",
          boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.5)",
        }}
      />

      {searchPerformed && searchResults.length === 0 && (
        <>
          <h2>Search Results:</h2>
          <p>No users found.</p>
        </>
      )}

      <div>
        {searchResults.map((user) => (
          <SearchedUser key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

SearchedUser.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};
