import { AxiosRequestConfig } from 'axios';
import { axios } from '../Base';

export const fetcher = (url: string, config?: AxiosRequestConfig) =>
  axios.get(url, { ...config });
