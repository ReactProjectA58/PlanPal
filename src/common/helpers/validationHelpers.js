import { getAllUsers } from "../../services/users.service";

import {
  EMAIL_FORMAT,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  NAME_FORMAT,
  PASSWORD_FORMAT,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PHONE_FORMAT,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from "../constants";

export const USERNAME_LENGTH_ERROR = `Username must be between ${USER_NAME_MIN_LENGTH} and ${USER_NAME_MAX_LENGTH} characters.`;
export const USERNAME_EXISTS_ERROR = "User with this username already exists!";
export const FIRST_NAME_ERROR = `First name must contain only letters and be between ${FIRST_NAME_MIN_LENGTH} and ${FIRST_NAME_MAX_LENGTH} characters.`;
export const LAST_NAME_ERROR = `Last name must contain only letters and be between ${LAST_NAME_MIN_LENGTH} and ${LAST_NAME_MAX_LENGTH} characters.`;
export const PHONE_FORMAT_ERROR =
  "Phone number must contain only digits and be 10 characters long.";
export const PHONE_EXISTS_ERROR = "User with this phone number already exists!";
export const PASSWORD_MATCH_ERROR = "Passwords do not match!";
export const PASSWORD_LENGTH_ERROR = `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`;
export const PASSWORD_COMPLEXITY_ERROR = `Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.`;
export const EMAIL_FORMAT_ERROR = "Invalid email address.";
export const EMAIL_EXISTS_ERROR = "User with this email already exists!";

export const validateRegister = async (formData, isUpdate = false, handle = null) => {
  const validationErrors = {};

  const snapshot = await getAllUsers();
  const allUsers = snapshot.exists() ? Object.values(snapshot.val()) : [];

  const filteredUsers = handle ? allUsers.filter(user => user.handle !== handle) : allUsers;

  if (
    formData.userName &&
    (formData.userName.length < USER_NAME_MIN_LENGTH ||
    formData.userName.length > USER_NAME_MAX_LENGTH)
  ) {
    validationErrors.userName = USERNAME_LENGTH_ERROR;
  } else if (!isUpdate && allUsers.find((user) => user.userName === formData.userName)) {
    validationErrors.userName = USERNAME_EXISTS_ERROR;
  }

  if (!NAME_FORMAT.test(formData.firstName)) {
    validationErrors.firstName = FIRST_NAME_ERROR;
  }

  if (!NAME_FORMAT.test(formData.lastName)) {
    validationErrors.lastName = LAST_NAME_ERROR;
  }

  if (
    formData.password &&
    (formData.password.length < PASSWORD_MIN_LENGTH ||
    formData.password.length > PASSWORD_MAX_LENGTH)
  ) {
    validationErrors.password = PASSWORD_LENGTH_ERROR;
  } else if (formData.password && !PASSWORD_FORMAT.test(formData.password)) {
    validationErrors.password = PASSWORD_COMPLEXITY_ERROR;
  }

  if (
    formData.password &&
    formData.password !== formData.confirmPassword
  ) {
    validationErrors.confirmPassword = PASSWORD_MATCH_ERROR;
  }

  if (!PHONE_FORMAT.test(formData.phoneNumber)) {
    validationErrors.phoneNumber = PHONE_FORMAT_ERROR;
  } else if (filteredUsers.find((user) => user.phoneNumber === formData.phoneNumber)) {
    validationErrors.phoneNumber = PHONE_EXISTS_ERROR;
  }

  if (!EMAIL_FORMAT.test(formData.email)) {
    validationErrors.email = EMAIL_FORMAT_ERROR;
  } else if (filteredUsers.find((user) => user.email === formData.email)) {
    validationErrors.email = EMAIL_EXISTS_ERROR;
  }

  return validationErrors;
};
