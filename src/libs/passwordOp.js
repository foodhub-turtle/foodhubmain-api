import bcrypt from 'bcryptjs';
const SALT_HASH_KEY = 11;

//SALT_HASH_KEY is the CPU intensive factor require to hash a password
export const hashPassword = password => bcrypt.hash(password, SALT_HASH_KEY);

//Comapre login password 
export const comparePassord = (password, dbPassword) =>
  bcrypt.compare(password, dbPassword);

export const isPasswordChanged = (jwtExpiresTime, passwordChangedAt) => passwordChangedAt > jwtExpiresTime;