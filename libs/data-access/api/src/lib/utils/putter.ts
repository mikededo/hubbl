import { AxiosRequestConfig } from 'axios';
import { axios } from '../Base';

export const putter = <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
) => axios.put<T>(url, data, { ...config });
