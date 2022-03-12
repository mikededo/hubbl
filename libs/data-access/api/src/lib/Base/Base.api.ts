import axios from 'axios';
import { CookieJar } from 'tough-cookie';

declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

const jar = new CookieJar();

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: `http://127.0.0.1:3333/api`,
  headers: { 'Content-Type': 'application/json' },
  jar
});

export { instance as axios };
