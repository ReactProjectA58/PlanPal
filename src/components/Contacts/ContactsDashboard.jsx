import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { searchUsers } from "../../services/search.service";
import ContactPanel from "./ContactPanel/ContactPanel";
import {
  contactListsListener,
  addContact,
  removeContact,
} from "../../services/contacts.service";
import { AppContext } from "../../context/AppContext";
import { getAllUsers } from "../../services/users.service";

export default function ContactsDashboard() {
  const { userData } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [currentView, setCurrentView] = useState("My Contacts");
  const [clearSearch, setClearSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [contactLists, setContactLists] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    let unsubscribe;
    if (userData) {
      getAllUsers()
        .then((snapshot) => {
          if (snapshot.exists()) {
            setAllUsers(Object.values(snapshot.val()));
            const userContactsSet = new Set(Object.keys(userData?.contacts));
            const userContactsArray = Object.values(snapshot.val()).filter(
              (user) =>
                user.handle && userContactsSet.has(user.handle.toLowerCase())
            );
            setAllContacts(userContactsArray);
          }
        })
        .catch((error) => {
          console.error("Error fetching all users:", error);
        });
    } else {
      setAllContacts([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userData?.contacts]);

  useEffect(() => {
    let unsubscribe;

    if (userData?.handle) {
      unsubscribe = contactListsListener(userData.handle, setContactLists);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userData?.handle]);

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

  const handleAddContact = (contactHandle) => {
    addContact(userData.handle, contactHandle)
      .then(() => {
        const foundUser = allUsers.find(
          (user) => user.handle === contactHandle
        );

        if (foundUser) {
          setAllContacts((prevContacts) => [...prevContacts, foundUser]);
        }
      })
      .catch((error) => {
        console.error("Error adding contact:", error);
      });
  };

  const handleRemoveContact = (contactHandle) => {
    removeContact(userData.handle, contactHandle)
      .then(() => {
        console.log("Contact removed");
        setAllContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.handle !== contactHandle)
        );
      })
      .catch((error) => {
        console.error("Error removing contact:", error);
      });
  };

  return (
    <div>
      <ContactPanel
        isSearching={isSearching}
        currentView={currentView}
        setCurrentView={setCurrentView}
        clearSearch={clearSearch}
        setClearSearch={setClearSearch}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        allContacts={allContacts}
        contactLists={contactLists}
        onAddContact={handleAddContact}
        onRemoveContact={handleRemoveContact}
      />
    </div>
  );
}
