import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/users";

const usersEndpoint = axios.create({
  baseURL: url,
});

usersEndpoint.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${token.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function findUsers(query: any) {
  const params = new URLSearchParams(query);

  return await usersEndpoint.get("/", { params });
}

export async function findDeletedUsers(query: any) {
  const params = new URLSearchParams(query);

  return await usersEndpoint.get("/trash", { params });
}

export async function findUser(id: string) {
  return await usersEndpoint.get(`/${id}`);
}

export async function findUsersByName(name: string, query: any) {
  const params = new URLSearchParams(query);

  return await usersEndpoint.get(`/name/${name}`, { params });
}

export async function addUser(params: any) {
  return await usersEndpoint.post("/add", params);
}

export async function editUser(id: string, params: any) {
  return await usersEndpoint.put(`/edit/${id}`, params);
}

export async function deleteUser(id: string) {
  return await usersEndpoint.delete(`/delete/${id}`);
}

export async function restoreUser(id: string) {
  return await usersEndpoint.put(`/restore/${id}`);
}
