import axios from 'axios';

export const UnauthApiInstance = (endpoint: string) =>
  axios.create({
    baseURL: `localhost:3333/api/${endpoint}`
  });

export const AuthApiInstance = (endpoint: string, token: string) =>
  axios.create({
    baseURL: `localhost:3333/api/${endpoint}`,
    headers: { Authorization: `Bearer ${token}` }
  });
