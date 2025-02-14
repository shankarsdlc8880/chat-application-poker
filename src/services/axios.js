import axios from 'axios';
// import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_CHAT_SERVICE_API_URL;
const authBaseURL = process.env.REACT_APP_AUTH_API_URL;

const axiosApi = axios.create({
  baseURL:baseURL,
});
const axiosAuthApi = axios.create({
  baseURL: authBaseURL,
});

const privateAxios = axios.create({
  baseURL,
});

privateAxios.interceptors.request.use(
  (config) => {

    // const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkODY5ODgyLWQyYjgtNGFjMS1hMzMxLTE5MDE3MTQ0NjBiYiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM5NDI1NjIzLCJleHAiOjE3NDIwMTc2MjMsImlzcyI6IlBva2VyIEF1dGhlbnRpY2F0aW9uIHNlcnZpY2UiLCJzdWIiOiJ0ZXN0QHNkbGNjb3JwLmNvbSJ9.UYJJU5on0jcU9vtkQxdcsyaM5R7V7gGxpRnwZSzqOsGWMMJxrW51-u-gSf1UFpyM1wGrLcirClymYj7V5tCotGtCFp4VD3OBg-rS0YlqjnitCQpBu9-pt9draFDzO8KFFdmN3_X0hKXOtspROfofhsCehnlXxZKXLWyc9sR0ZXbKgG1CMI8vZ21QJHsun1PyXkAGF2i7sg9ovhW9hw-lRObjwTKMKwhftuVwaZIOdonDLo7Q5hTt3wRaCbiRK9HgkRq_eKCQo77WemY9mElXD2jYxiQ-K7sja0TKswn5ZmG-f9VKg_IwKcjH0Lm79M_oLdw1wFW4M16SHWY7k50ZzA';
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosApi.post('/v1/auth/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return privateAxios(originalRequest);
      } catch (error) {
        window.localStorage.clear()
          alert("Your login session has expired. Please log in again.")
          // toast.error("Your login session has expired. Please log in again.")
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
      }
    }

    return Promise.reject(error);
  }
);

export {
  privateAxios,
  axiosAuthApi,
  axiosApi
};