import axios from 'axios';

const {
  VUE_APP_API_URL
} = process.env

export default function api({ headers }) {
  const instance = axios.create({
    baseURL: VUE_APP_API_URL,
    timeout: 60000,
    headers
  });

  return instance;
}
