import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchUsers } from "../../services/search.service";
import { Contacts, GoBack } from "../../common/helpers/icons";
import SearchBar from "../SearchBar/SearchBar";

export default function ContactsList() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentView, setCurrentView] = useState("My Contacts");
  const [clearSearch, setClearSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get("query");
    setIsSearching(!!queryParam);
    if (queryParam) {
      searchUsers(queryParam)
        .then((userResults) => {
          setSearchResults(userResults);
          setSearchQuery(queryParam);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [location.search]);

  const getContacts = () => {
    if (isSearching) {
      return searchResults;
    }
    return [];
  };

  const handleSearch = (query) => {
    navigate(`/contacts?query=${query}`);
  };

  const handleContactsBackClick = () => {
    navigate("/contacts");
    setCurrentView("My Contacts");
    setClearSearch((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr] gap-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center ml-5 mb-6 flex-col md:flex-row">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            {isSearching ? (
              <a onClick={handleContactsBackClick}>
                <Contacts />
              </a>
            ) : (
              <GoBack />
            )}
            <h2 className="text-lg md:ml-4">
              {isSearching
                ? `Contacts Found for '${searchQuery}'`
                : currentView}
            </h2>
          </div>
          <SearchBar
            onSearch={handleSearch}
            currentView={currentView}
            clearSearch={clearSearch}
          />
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
                  <div className="text-sm">
                    <strong className="text-gray-600">Username:</strong>{" "}
                    {contact.handle}
                  </div>
                  <div className="text-sm">
                    <strong className="text-gray-600">Email:</strong>{" "}
                    {contact.email}
                  </div>
                  <div className="text-sm">
                    <strong className="text-gray-600">Phone:</strong>{" "}
                    {contact.phoneNumber}
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
