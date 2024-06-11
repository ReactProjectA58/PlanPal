import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { blockUser, unblockUser } from "../../services/admin.service.js";
import { EVENT_COVER_BY_DEFAULT } from "../../common/constants.js";

export default function SearchedUser({ user }) {
  const { userData } = useContext(AppContext);
  const [isBlocked, setIsBlocked] = useState(user.isBlocked);
  const isAdmin = userData && userData.isAdmin;

  const handleBlockUser = async () => {
    const confirmBlock = window.confirm(
      "Please confirm you want to block this user."
    );
    if (!confirmBlock) {
      return; // User canceled the action
    }

    try {
      await blockUser(user.handle);
      setIsBlocked(true);
      alert("User has been blocked successfully.");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      await unblockUser(user.handle);
      setIsBlocked(false);
      alert("User has been unblocked successfully.");
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div className="event-card shadow-xl transform transition-transform hover:scale-105 mt-4 flex flex-row items-center p-4 space-x-4 rounded-lg max-w-2xl mx-auto">
      <figure className="w-48 h-48">
        <img
          src={user.avatar || EVENT_COVER_BY_DEFAULT}
          alt="User Avatar"
          className="event-cover rounded-xl w-full h-full object-cover"
        />
      </figure>
      <div className="card-body flex flex-col space-y-2">
        <h2 className="card-title text-xl font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <div className="grid grid-cols-3 gap-4 text-gray-500 text-xs">
          <p className="col-span-3">Username: {user.handle}</p>
          <p className="col-span-3">Email: {user.email}</p>
        </div>
        <div className="card-actions flex space-x-2">
          {isBlocked ? (
            <button className="btn" onClick={handleUnblockUser}>
              Unblock User
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={handleBlockUser}>
              Block User
            </button>
          )}
          {isAdmin && (
            <Link to={`/user/${user.id}`} className="profile-link">
              <button className="btn btn-primary">Profile</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

SearchedUser.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    isBlocked: PropTypes.bool.isRequired,
  }).isRequired,
};
