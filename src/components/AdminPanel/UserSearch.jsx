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
    <div className="flex flex-col items-center my-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for user..."
        className="border-2 border-gray-300 bg-white text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-lg px-4 py-2"
      />

      {searchPerformed && searchResults.length === 0 && (
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">Search Results:</h2>
          <p className="text-gray-500">No users found.</p>
        </div>
      )}

      <div className="mt-6 w-full max-w-3xl">
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
