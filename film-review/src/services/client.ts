import axios from "axios";

console.log("leg: ", process.env.REACT_APP_DB_API_URL);

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_DB_API_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
