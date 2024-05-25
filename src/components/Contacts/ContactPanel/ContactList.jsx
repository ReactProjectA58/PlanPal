import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelLists from "./PanelLists";

export default function ContactList({
  setCurrentView,
  contactLists,
  allContacts,
}) {
  const [renderedContacts, setRenderedContacts] = useState([]);
  const [visibleContacts, setVisibleContacts] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (contactLists) {
      setRenderedContacts(contactLists.slice(0, visibleContacts));
    }
  }, [contactLists, visibleContacts]);

  console.log(contactLists);

  return (
    <div>
      <span
        className={`text-sm font-bold cursor-pointer select-none tracking-wider `}
        onClick={() => {
          setCurrentView("My Contacts");
          navigate("/contacts");
        }}
      >
        My Contacts
      </span>

      {renderedContacts &&
        renderedContacts.map((list) => {
          return (
            <PanelLists
              key={list.title + list.key}
              list={list}
              allContacts={allContacts}
              setCurrentView={setCurrentView}
            />
          );
        })}
    </div>
  );
}

ContactList.propTypes = {
  currentView: PropTypes.string,
  setCurrentView: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
  allContacts: PropTypes.arrayOf(PropTypes.object),
  isSearching: PropTypes.bool,
};
