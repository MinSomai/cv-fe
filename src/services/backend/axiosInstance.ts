import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const instance = ({ token, baseURL }: { token?: string, baseURL?: string } = {}): AxiosInstance => {
  const baseURLLocal = baseURL || process.env.NEXT_PUBLIC_PAYLOAD_URL_API;

  const axiosArgs: AxiosRequestConfig = {
    baseURL: baseURLLocal,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token && axiosArgs.headers) {
    axiosArgs.headers.Authorization = `Bearer ${token}`;
  }

  const axiosInstance = axios.create(axiosArgs);

  return axiosInstance;
};

export default instance;

