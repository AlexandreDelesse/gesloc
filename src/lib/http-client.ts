import axios from "axios";

export const httpClient = axios.create({
  baseURL: "http://localhost:5114/api",
  timeout: 10000,
});
