import type {
  AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse
} from 'axios';
import axios from 'axios';
import showCodeMessage from 'a@/errorCodeMsg';
import { displayedErrors } from 'u@/dataMap'
import formatJsonToUrlParams, { instanceObject } from 'u@/format';
import { message as AntdMessage } from "antd";

interface IErrorData {
  code: number;
  message: string;
  status: 'success' | 'error'
};

const isProd = import.meta.env.NODE_ENV === 'production';
const BASE_URL = (
  isProd ? import.meta.env.VITE_APP_PUBLIC_PATH : import.meta.env.VITE_APP_BASE_URL
);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 10,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  /**
   * transformRequest 允许在向服务器发送前，修改请求数据。
   * 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法。
   * 后面数组中的函数必须返回一个 字符串/ArrayBuffer/Stream。
   */
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const { response, message = '' } = error;
    if (response) {
      const statusCode = response.status;
      const data = response.data as IErrorData;
      const errorMessage = data.message || showCodeMessage(statusCode);
      const errorPath = response.config.url || ''; // 请求的路径

      // 只在错误路径未被处理过的情况下显示错误消息
      if (!displayedErrors.has(errorPath)) {
        AntdMessage.error({
          content: errorMessage || message,
          duration: 2,
        });
        displayedErrors.add(errorPath); // 添加到已显示错误的集合中
      }

      return Promise.reject(response.data);
    };
    // 网络异常或请求超时
    if (!displayedErrors.has('network_error')) {
      AntdMessage.error({
        content: '网络连接异常，请稍后再试！',
        duration: 3,
      });
      displayedErrors.add('network_error');
    };
    return Promise.reject(error);
  },
);

const service = {
  get<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.get(url, { params: data });
  },

  post<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.post(url, data);
  },

  put<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.put(url, data);
  },

  delete<T = any>(url: string, data?: object): Promise<T> {
    return axiosInstance.request({
      url,
      method: 'DELETE',
      data
    });
  },

  upload: (url: string, file: FormData | File) => (
    axiosInstance.post(url, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ),

  download: (url: string, data: instanceObject) => {
    window.location.href = `${BASE_URL}/${url}?${formatJsonToUrlParams(data)}`;
  },
};

export default service;
