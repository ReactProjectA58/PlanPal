import PropTypes from "prop-types";
import { useContext, useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Contacts,
  GoBack,
  Minus,
  MinusToggle,
  Plus,
  PlusToggle,
} from "../../../common/helpers/icons";
import CreateNewContactList from "./CreateNewContactList";
import ContactList from "./ContactList";
import SearchBar from "../../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

export default function ContactPanel({
  isSearching,
  currentView,
  setCurrentView,
  clearSearch,
  setClearSearch,
  searchQuery,
  searchResults,
  isChecked,
  setIsChecked,
  contactLists,
  allContacts,
  onAddContact,
  onRemoveContact,
}) {
  const { userData } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowUp, setIsArrowUp] = useState(false);
  const [addedContacts, setAddedContacts] = useState([]);
  const navigate = useNavigate();

  const toggleCollapsePlus = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleCollapseArrow = () => {
    setIsArrowUp((prev) => !prev);
  };

  const getContacts = () => {
    if (isSearching) {
      return searchResults;
    } else if (currentView === "My Contacts") {
      return addedContacts
        .map((contactHandle) =>
          allContacts.find((contact) => contact.handle === contactHandle)
        )
        .filter(Boolean);
    }
    return [];
  };

  const isLoggedInUser = (contactHandle) => {
    return userData && userData.handle === contactHandle;
  };

  const handleSearch = (query) => {
    navigate(`/contacts?query=${query}`);
  };

  const handleContactsBackClick = () => {
    navigate("/contacts");
    setCurrentView("My Contacts");
    setClearSearch((prev) => !prev);
  };

  const isAddedContact = (contactHandle) => {
    return addedContacts.includes(contactHandle);
  };

  const handleToggleContact = (contactHandle) => {
    if (isAddedContact(contactHandle)) {
      onRemoveContact(contactHandle);
      setAddedContacts(addedContacts.filter((c) => c !== contactHandle));
    } else {
      onAddContact(contactHandle);
      setAddedContacts([...addedContacts, contactHandle]);
    }
  };

  useEffect(() => {
    const storedContacts = localStorage.getItem("addedContacts");
    if (storedContacts) {
      setAddedContacts(JSON.parse(storedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addedContacts", JSON.stringify(addedContacts));
  }, [addedContacts]);

  return (
    <div>
      <h1 className="text-3xl rounded-lg shadow-2xl max-w-fit mx-auto my-auto p-4">
        Contacts Dashboard
      </h1>

      <div className="flex justify-between items-center flex-col md:flex-row p-3">
        <div className="flex items-center justify-between mb-4 md:mb-0">
          {isSearching ? (
            <a onClick={handleContactsBackClick}>
              <Contacts />
            </a>
          ) : (
            <GoBack />
          )}
          <h2 className="text-lg md:ml-4">
            {isSearching ? `Contacts Found for '${searchQuery}'` : currentView}
          </h2>
        </div>
        <SearchBar
          onSearch={handleSearch}
          currentView={currentView}
          clearSearch={clearSearch}
        />
      </div>

      <div className={getContacts().length > 3 ? "overflow-y-scroll h-96" : ""}>
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
                      <td className="flex items-center gap-3 w-1/3">
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
                          <div className="text-sm opacity-50">Bulgaria</div>
                        </div>
                      </td>
                      <td className="flex flex-col items-center justify-center text-center w-1/5">
                        {contact.handle} <br />
                        <span className="badge badge-ghost badge-sm">
                          {contact.email}
                        </span>
                      </td>
                      {!isLoggedInUser(contact.handle) && (
                        <td className="flex items-center justify-center mr-6">
                          <div
                            className="tooltip"
                            data-tip={
                              isAddedContact(contact.handle)
                                ? "Remove user"
                                : "Add user"
                            }
                          >
                            <label className="swap">
                              <input
                                type="checkbox"
                                checked={isAddedContact(contact.handle)}
                                onChange={() =>
                                  handleToggleContact(contact.handle)
                                }
                              />
                              {isAddedContact(contact.handle) ? (
                                <Minus />
                              ) : (
                                <Plus />
                              )}
                            </label>
                          </div>
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="collapse bg-base-200 mb-2">
        <input
          type="checkbox"
          checked={isArrowUp}
          onChange={toggleCollapseArrow}
        />
        <div className="flex justify-between collapse-title text-xl font-medium">
          <label className="swap">
            <input type="checkbox" checked={isArrowUp} readOnly />
            {isArrowUp ? <ArrowUp /> : <ArrowDown />}
          </label>
          <span>Contact Lists</span>
        </div>
        <div className="collapse-content">
          <ContactList
            currentView={currentView}
            setCurrentView={setCurrentView}
            contactLists={contactLists}
            allContacts={allContacts}
            isSearching={isSearching}
          />
        </div>
      </div>

      <div>
        <div className="collapse bg-base-200">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={toggleCollapsePlus}
          />

          <div className="flex justify-between collapse-title text-xl font-medium">
            <span>Create New Contact List</span>
            <label className="swap">
              <input type="checkbox" checked={isOpen} readOnly />
              {isOpen ? <MinusToggle /> : <PlusToggle />}
            </label>
          </div>
          <div className="collapse-content">
            <CreateNewContactList />
          </div>
        </div>
      </div>
    </div>
  );
}

ContactPanel.propTypes = {
  currentView: PropTypes.string,
  setCurrentView: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
  allContacts: PropTypes.arrayOf(PropTypes.object),
  isSearching: PropTypes.bool,
  clearSearch: PropTypes.bool,
  setClearSearch: PropTypes.func,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  isChecked: PropTypes.bool,
  setIsChecked: PropTypes.func,
  onAddContact: PropTypes.func,
  onRemoveContact: PropTypes.func,
};
