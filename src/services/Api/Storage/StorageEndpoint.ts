import axios from "axios";

const url = process.env.REACT_APP_URL + "/storage";

const storageEndpoint = axios.create({
  baseURL: url,
});

storageEndpoint.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${token.token}`;

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
