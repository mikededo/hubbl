import axios from 'axios';

axios.defaults.withCredentials = true;

export const UnauthApiInstance = (endpoint: string) =>
  axios.create({
    baseURL: `http://localhost:3333/api/${endpoint}`,
    headers: { 'Content-Type': 'application/json' },
  });

export const AuthApiInstance = (endpoint: string, token: string) =>
  axios.create({
    baseURL: `http://localhost:3333/api/${endpoint}`,
    headers: { Authorization: `Bearer ${token}` }
  });
