import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchUsers } from "../../services/search.service";
import SearchBar from "../SearchBar/SearchBar";

export default function ContactsList() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get("query");
    setIsSearching(!!queryParam);
    if (queryParam) {
      searchUsers(queryParam)
        .then((userResults) => {
          setSearchResults(userResults);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [location.search]);

  const getContacts = () => {
    if (isSearching) {
      return searchResults;
    } else {
      return [];
    }
  };

  const handleSearch = (query) => {
    navigate(`/contacts?query=${query}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr] gap-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center ml-5 mb-6 flex-col md:flex-row">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="card-container">
          <ul>
            {getContacts().map((contact, index) => (
              <li
                key={index}
                className="mb-4 p-4 bg-transparent rounded-lg shadow-xl"
              >
                <div className="flex flex-col">
                  <div className="text-lg font-semibold">
                    {contact.firstName} {contact.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Username:</strong> {contact.handle}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Email:</strong> {contact.email}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Phone:</strong> {contact.phoneNumber}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
