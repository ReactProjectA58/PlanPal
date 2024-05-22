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
  MIN_TITLE_LENGTH, 
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
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
export const TITLE_ERROR = `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters.`;
export const DESCRIPTION_ERROR = `Content must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters.`;
export const START_DATE_REQUIRED_ERROR = 'Start date is required.';
export const END_DATE_REQUIRED_ERROR = 'End date is required.';
export const START_DATE_PERIOD_ERROR = 'Start date must be in the future.';
export const END_DATE_PERIOD_ERROR = 'End date must be after start date.';


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

export const validateEvent = (title, description, startDate, endDate) => {
  const formErrors = {};

  if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) {
    formErrors.title = TITLE_ERROR;
  }

  if (
    description.length < MIN_DESCRIPTION_LENGTH ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    formErrors.description = DESCRIPTION_ERROR;
  }

  if (!startDate) {
    formErrors.startDate = START_DATE_REQUIRED_ERROR;
  }

  if (!endDate) {
    formErrors.endDate = END_DATE_REQUIRED_ERROR;
  }

  if (startDate && endDate && startDate > endDate) {
    formErrors.endDate = END_DATE_PERIOD_ERROR;
  }

  if (startDate && startDate < new Date()) {
    formErrors.startDate = START_DATE_PERIOD_ERROR;
  }

  if (Object.keys(formErrors).length === 0) {
    return false;
  }

  return formErrors;
};

export const validateTitle = (title) => {
  if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) {
    return TITLE_ERROR;
  }

  return false;
};

export const validateDescription = (description) => {
  if (
    description.length < MIN_DESCRIPTION_LENGTH ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    return DESCRIPTION_ERROR;
  }

  return false;
};
