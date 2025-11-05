import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});


const api_v1 = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_V1_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});




export { api, api_v1 };


