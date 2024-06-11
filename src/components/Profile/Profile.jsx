import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByHandle, updateUser } from "../../services/users.service";
import { uploadAvatar } from "../../services/upload.service";
import { validateRegister } from "../../common/helpers/validationHelpers";
import UploadButton from "../UploadButton";

function Profile() {
  const { handle } = useParams();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    avatar: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const userSnapshot = await getUserByHandle(handle);
        if (userSnapshot.exists()) {
          const data = userSnapshot.val();
          setUserData({
            ...data,
          });
          setAvatarPreview(data.avatar);
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
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const validationErrors = await validateRegister(userData, true, handle);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let avatarUrl = userData.avatar;
      if (avatar) {
        avatarUrl = await uploadAvatar(handle, avatar);
      }
      await updateUser(handle, { ...userData, avatar: avatarUrl });
      setIsEditing(false);
      setErrors({});
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-semibold mb-4">My Profile</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-10">
                {" "}
                <div>
                  {isEditing ? (
                    <>
                      {avatarPreview && (
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="w-16 h-16 rounded-full mt-2"
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                </div>
                {isEditing && <UploadButton onFileChange={handleFileChange} />}
              </div>
            </div>
            <div>
              <label className="text-lg font-medium">Username: </label>
              <span className="text-lg">{userData.handle}</span>
            </div>
            <div>
              <label className="text-lg font-medium">First Name: </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName}</p>
                  )}
                </>
              ) : (
                <span className="text-lg">{userData.firstName}</span>
              )}
            </div>
            <div>
              <label className="text-lg font-medium">Last Name: </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName}</p>
                  )}
                </>
              ) : (
                <span className="text-lg">{userData.lastName}</span>
              )}
            </div>
            <div>
              <label className="text-lg font-medium">Phone: </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500">{errors.phoneNumber}</p>
                  )}
                </>
              ) : (
                <span className="text-lg">{userData.phoneNumber}</span>
              )}
            </div>
            <div>
              <label className="text-lg font-medium">Email: </label>
              {isEditing ? (
                <>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email}</p>
                  )}
                </>
              ) : (
                <span className="text-lg">{userData.email}</span>
              )}
            </div>
            <div>
              <label className="text-lg font-medium">Address: </label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500">{errors.address}</p>
                  )}
                </>
              ) : (
                <span className="text-lg">{userData.address}</span>
              )}
            </div>
            {isEditing && (
              <>
                <div>
                  <label className="text-lg font-medium">Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="text-lg font-medium">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            {isEditing ? (
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
