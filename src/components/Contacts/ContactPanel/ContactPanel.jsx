import PropTypes from "prop-types";
import { useState } from "react";
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

// THIS IS THE SEARCHER FOR THE
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowUp, setIsArrowUp] = useState(false);
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
    }
    return [];
  };

  const handleTooltip = () => {
    setIsChecked((prev) => !prev);
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
    <div>
      <div>
        <h1 className="text-3xl rounded-lg shadow-2xl max-w-fit mx-auto my-auto p-4">
          Contacts Dashboard
        </h1>

        <div className="flex flex-col m-0">
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
                            <div className="text-sm opacity-50">Bulgaria</div>
                          </div>
                        </td>
                        <td className="flex flex-col items-center justify-center text-center  w-1/5">
                          {contact.handle} <br />
                          <span className="badge badge-ghost badge-sm">
                            {contact.email}
                          </span>
                        </td>

                        <td className="flex items-center justify-center mr-6">
                          <div
                            className="tooltip"
                            data-tip={isChecked ? "Remove user" : "Add user"}
                          >
                            <label className="swap">
                              <input
                                type="checkbox"
                                defaultChecked={isChecked}
                                onClick={handleTooltip}
                              />
                              <Minus />
                              <Plus />
                            </label>
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

          <div className="flex justify-between collapse-title text-xl font-medium ">
            <span>Create New Contact List</span>{" "}
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
  setIsSearching: PropTypes.bool,
};
