import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/sales";

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

export async function filterSales(query: any) {
  const params = new URLSearchParams(query);

  return await salesEndpoint.get("/filter", { params });
}

export async function addSale(params: any) {
  return await salesEndpoint.post("/add", params);
}

export async function deleteSale(id: string) {
  return await salesEndpoint.delete(`/delete/${id}`);
}
