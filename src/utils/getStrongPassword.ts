import { customAlphabet } from "nanoid";

const numbers = "0123456789";
const getNumber = customAlphabet(numbers, 1);

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getUpperCase = customAlphabet(upperCase, 1);

const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const getLowerCase = customAlphabet(lowerCase, 1);

const specials = "!@#$%^&*()+";
const getSpecial = customAlphabet(specials, 1);

const full = numbers + upperCase + lowerCase + specials;
const getFull = customAlphabet(full, 10);

const getStrongPassword = () =>
  getUpperCase() + getNumber() + getLowerCase() + getSpecial() + getFull();

export default getStrongPassword;
