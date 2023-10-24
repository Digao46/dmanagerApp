import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/clients";

const clientsEndpoint = axios.create({
  baseURL: url,
});

clientsEndpoint.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${token.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function findClients(query: any) {
  const params = new URLSearchParams(query);

  return await clientsEndpoint.get("/", { params });
}
