import { AxiosRequestConfig } from 'axios';
import { axios } from '../Base';

export const poster = <T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
) => axios.post<T>(url, data, { ...config });
