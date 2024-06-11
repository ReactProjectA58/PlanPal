import { useContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { blockUser, unblockUser } from "../../services/admin.service.js";
import "./SearchedUser.css";

export default function SearchedUser({ user }) {
  const { userData } = useContext(AppContext);
  const [isBlocked, setIsBlocked] = useState(user.isBlocked);
  const isAdmin = userData && userData.isAdmin;

  const handleBlockUser = async () => {
    try {
      await blockUser(user.handle);
      setIsBlocked(true);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      await unblockUser(user.handle);
      setIsBlocked(false);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  return (
    <div className="outer-border">
      <div className="user-info">
        <div>
          <p className="name-label">Name:</p>
          <div className="name">
            {user.firstName} {user.lastName}
          </div>
        </div>
        <div>
          <p className="username-label">Username:</p>
          <div className="username">{user.handle}</div>
        </div>
        <div>
          <p className="email-label">Email:</p>
          <div className="email">{user.email}</div>
        </div>

        {isBlocked && (
          <button className="unblock-button" onClick={handleUnblockUser}>
            Unblock User
          </button>
        )}

        {!isBlocked && (
          <button className="block-button" onClick={handleBlockUser}>
            Block User
          </button>
        )}

        {isAdmin && (
          <Link to={`/user/${user.id}`} className="profile-link">
            <button className="profile-button">Profile</button>
          </Link>
        )}
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
    isBlocked: PropTypes.bool.isRequired
  }).isRequired,
};
