import { storage } from "../config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadAvatar = async (userId, file) => {
  try {
    const avatarRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(avatarRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const uploadCover = async (eventId, file) => {
  try {
    const coverRef = ref(storage, `covers/${eventId}`);
    await uploadBytes(coverRef, file);
    const downloadURL = await getDownloadURL(coverRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading cover:", error);
    throw error;
  }
};
