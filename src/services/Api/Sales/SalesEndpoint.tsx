import axios from "axios";

const url = process.env.REACT_APP_URL + "/sales";

const salesEndpoint = axios.create({
  baseURL: url,
});

salesEndpoint.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${token.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function findSales(query: any) {
  const params = new URLSearchParams(query);

  return await salesEndpoint.get("/", { params });
}