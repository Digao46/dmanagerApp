import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/storage";

const storageEndpoint = axios.create({
  baseURL: url,
});

storageEndpoint.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")!);

    config.headers["company_id"] = user.companyId;
    config.headers!.Authorization = `Bearer ${user.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function findProducts(query: any) {
  const params = new URLSearchParams(query);

  return await storageEndpoint.get("/", { params });
}

export async function findDeletedProducts(query: any) {
  const params = new URLSearchParams(query);

  return await storageEndpoint.get("/trash", { params });
}

export async function findProduct(id: string) {
  return await storageEndpoint.get(`/${id}`);
}

export async function findProductsByName(name: string, query: any) {
  const params = new URLSearchParams(query);

  return await storageEndpoint.get(`/name/${name}`, { params });
}

export async function findCanMountProducts() {
  return await storageEndpoint.get("/canMount");
}

export async function addProduct(params: any) {
  return await storageEndpoint.post("/add", params);
}

export async function editProduct(id: string, params: any) {
  return await storageEndpoint.put(`/edit/${id}`, params);
}

export async function deleteProduct(id: string) {
  return await storageEndpoint.delete(`/delete/${id}`);
}

export async function restoreProduct(id: string) {
  return await storageEndpoint.put(`/restore/${id}`);
}
