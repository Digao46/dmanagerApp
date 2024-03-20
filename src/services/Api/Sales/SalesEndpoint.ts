import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/sales";

const salesEndpoint = axios.create({
  baseURL: url,
});

salesEndpoint.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${user.token}`;

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

export async function addSale(params: any) {
  return await salesEndpoint.post("/add", params);
}

export async function deleteSale(id: string) {
  return await salesEndpoint.delete(`/delete/${id}`);
}
