import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { Plus, TrashBin } from "../../../common/helpers/icons";
import {
  removeContact,
  updateContact,
} from "../../../services/contacts.service";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

export default function PanelLists({
  setCurrentView,
  list,
  renderedContacts,
  allContacts,
}) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    removeContact(id, userData.handle);
    setCurrentView("My Contacts");
  };

  const handleUpdateList = (listKey, contact) => {
    const user = contact.handle.toLowerCase();
    const updatedContacts = { ...list.contacts };

    if (user in updatedContacts) {
      delete updatedContacts[user];
    } else {
      updatedContacts[user] = true;
    }

    updateContact(listKey, contact, updatedContacts);
  };

  console.log({ allContacts }, "Panel lists");
  return (
    <ul className="mb-4 p-4 bg-transparent rounded-lg shadow-xl">
      <div className="flex items-center justify-between py-2">
        <span
          className={`text-sm cursor-pointer tracking-wider`}
          onClick={() => {
            setCurrentView(list.title);
            navigate("/contacts");
          }}
        >
          {list.title}
        </span>

        <div className="flex gap-4">
          <div className="dropdown dropdown-left dropdown-end">
            <div tabIndex={0} role="button" className="btn-ghost">
              <Plus />
            </div>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box overflow-y-scroll h-52">
              <li className="menu-title">
                <span>Contacts</span>
              </li>
              {allContacts && allContacts.length > 0 ? (
                allContacts?.map((contact) => {
                  const matchedContact = allContacts.find(
                    (c) => c.handle === contact?.handle
                  );
                  return matchedContact ? (
                    <li key={matchedContact.handle}>
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-md"
                          defaultChecked={
                            list.contacts &&
                            list.contacts[matchedContact.handle.toLowerCase()]
                          }
                          onChange={() =>
                            handleUpdateList(list.key, matchedContact)
                          }
                        />
                        <span className="label-text ml-2">
                          {matchedContact.handle}{" "}
                        </span>
                      </label>
                    </li>
                  ) : null;
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
