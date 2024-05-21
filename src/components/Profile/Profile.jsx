import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByHandle, updateUser } from "../../services/users.service";
import { uploadAvatar } from "../../services/upload.service";

function Profile() {
  const { handle } = useParams();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    avatar: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userSnapshot = await getUserByHandle(handle);
        if (userSnapshot.exists()) {
          const data = userSnapshot.val();
          setUserData(data);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [handle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      let avatarUrl = userData.avatar;
      if (avatar) {
        avatarUrl = await uploadAvatar(handle, avatar);
      }
      await updateUser(handle, { ...userData, avatar: avatarUrl });
      setIsEditing(false);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>
      <div className="flex flex-col space-y-2">
        <div>
          <label className="text-lg font-medium">First Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            <span className="text-lg">{userData.firstName}</span>
          )}
        </div>
        <div>
          <label className="text-lg font-medium">Last Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            <span className="text-lg">{userData.lastName}</span>
          )}
        </div>
        <div>
          <label className="text-lg font-medium">Phone:</label>
          {isEditing ? (
            <input
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            <span className="text-lg">{userData.phoneNumber}</span>
          )}
        </div>
        <div>
          <label className="text-lg font-medium">Avatar:</label>
          {isEditing ? (
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="input input-bordered"
            />
          ) : (
            <img src={userData.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
          )}
        </div>
      </div>
      <div className="mt-4">
        {isEditing ? (
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
