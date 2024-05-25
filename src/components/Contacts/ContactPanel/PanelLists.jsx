import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Plus, TrashBin } from "../../../common/helpers/icons";
import { deleteContactList } from "../../../services/contacts.service";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";

export default function PanelLists({ setCurrentView, list }) {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteContactList(id, userData.handle);
    setCurrentView("My Contacts");
  };

  return (
    <div className="flex items-center justify-between py-2 border-t border-black">
      <span
        className={`text-sm cursor-pointer tracking-wider `}
        onClick={() => {
          setCurrentView(list.title);
          navigate("/contacts");
        }}
      >
        {list.title}
      </span>

      <div className="flex gap-4">
        <button>
          <Plus />
        </button>
        <button onClick={() => handleDelete(list.key)}>
          <TrashBin />
        </button>
      </div>
    </div>
  );
}

PanelLists.propTypes = {
  list: PropTypes.object,
  isSelected: PropTypes.func,
  setCurrentView: PropTypes.func,
  allContacts: PropTypes.arrayOf(PropTypes.object),
};
