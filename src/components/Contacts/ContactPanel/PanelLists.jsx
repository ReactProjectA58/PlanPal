import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Plus, TrashBin } from "../../../common/helpers/icons";
import {
  deleteContactList,
  updateContact,
} from "../../../services/contacts.service";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { ToastContainer } from "react-toastify";
import { themeChecker } from "../../../common/helpers/toast";

export default function PanelLists({ setCurrentView, list, allContacts }) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    setContacts(list?.contacts || {});
  }, [list?.contacts]);

  const handleDelete = (id) => {
    themeChecker("Contact list deleted!");
    deleteContactList(id, userData?.handle);
    setCurrentView("My Contacts");
  };

  const handleUpdateList = (listKey, contact) => {
    const user = contact.handle.toLowerCase();
    const updatedContacts = { ...contacts };

    if (updatedContacts[user]) {
      delete updatedContacts[user];
      themeChecker(`${contact.handle} removed from ${list.title}!`);
    } else {
      updatedContacts[user] = true;
      themeChecker(`${contact.handle} added to ${list.title}!`);
    }

    setContacts(updatedContacts);
    updateContact(listKey, updatedContacts);
  };
  // console.log(list.contacts);

  return (
    <ul className="mb-4 p-4 bg-transparent rounded-lg shadow-xl">
      <div className="flex items-center justify-between py-2">
        <span
          className="text-sm cursor-pointer tracking-wider"
          onClick={() => {
            setCurrentView(list.title);
            navigate("/contacts");
          }}
        >
          {list.title}
        </span>

        <div className="flex gap-4">
          <div className="dropdown dropdown-left dropdown-end ">
            <div tabIndex={0} role="button" className="btn-ghost">
              <Plus />
            </div>
            <ul className="dropdown-content grid menu p-2 shadow bg-base-100 rounded-box overflow-auto h-auto max-h-48">
              <li className="menu-title">
                <span>Contacts</span>
              </li>
              {allContacts && allContacts.length > 0 ? (
                allContacts.map((contact) => {
                  const isContactInList =
                    (contacts && contacts[contact.handle.toLowerCase()]) ??
                    false;
                  return (
                    <li key={contact.handle}>
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-md"
                          checked={isContactInList}
                          onChange={() => handleUpdateList(list.key, contact)}
                        />
                        <span className="label-text ml-2">
                          {contact.handle}
                        </span>
                      </label>
                    </li>
                  );
                })
              ) : (
                <li className="text-center py-2">No contacts available</li>
              )}
            </ul>
          </div>
          <button onClick={() => handleDelete(list.key)}>
            <TrashBin />
          </button>
        </div>
      </div>
    </ul>
  );
}

PanelLists.propTypes = {
  list: PropTypes.object.isRequired,
  renderedContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  allContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCurrentView: PropTypes.func.isRequired,
};
