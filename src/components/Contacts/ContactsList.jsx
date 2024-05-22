import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchUsers } from "../../services/search.service";
import {
  Contacts,
  GoBack,
  MinusToggle,
  Plus,
  PlusToggle,
} from "../../common/helpers/icons";
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
    <div className="grid grid-cols-1 md:grid-cols-[1.8fr_2fr] gap-6">
      <div>
        <div className="flex flex-col m-0">
          <div className="flex justify-between items-center flex-col md:flex-row  pl-3">
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

          <ul>
            {getContacts().map((contact, index) => (
              <li
                key={index}
                className="mb-4 p-4 bg-transparent rounded-lg shadow-xl"
              >
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr></tr>
                    </thead>
                    <tbody>
                      <tr className="flex justify-between">
                        <td className="flex items-center gap-3   w-1/3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-20 h-16">
                              <img
                                src={contact.avatar}
                                alt="Avatar"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm opacity-50">
                              United States
                            </div>
                          </div>
                        </td>
                        <td className="flex flex-col items-center justify-center text-center  w-1/5">
                          {contact.handle} <br />
                          <span className="badge badge-ghost badge-sm">
                            {contact.email}
                          </span>
                        </td>

                        <td className="flex items-center justify-center mr-6">
                          <div className="tooltip" data-tip="Add contact">
                            <Plus />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="collapse bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            <label className="swap">
              <input type="checkbox" />
              <MinusToggle />
              <PlusToggle />
            </label>
          </div>
          <div className="collapse-content">
            <p>testing this</p>
          </div>
        </div>
      </div>
    </div>
  );
}
