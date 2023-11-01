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

export async function findDeletedClients(query: any) {
  const params = new URLSearchParams(query);

  return await clientsEndpoint.get("/trash", { params });
}

export async function findClient(id: string) {
  return await clientsEndpoint.get(`/${id}`);
}

export async function findClientsByName(name: string, query: any) {
  const params = new URLSearchParams(query);

  return await clientsEndpoint.get(`/name/${name}`, { params });
}

export async function addClient(params: any) {
  return await clientsEndpoint.post("/add", params);
}

export async function editClient(id: string, params: any) {
  return await clientsEndpoint.put(`/edit/${id}`, params);
}

export async function deleteClient(id: string) {
  return await clientsEndpoint.delete(`/delete/${id}`);
}

export async function restoreClient(id: string) {
  return await clientsEndpoint.put(`/restore/${id}`);
}
