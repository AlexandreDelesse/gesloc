import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://api.gesloc.ade-dev.fr/api",
  timeout: 10000,
});
