import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/tabcard";

const tabCardEndpoint = axios.create({
  baseURL: url,
});

tabCardEndpoint.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${user.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function findTabCardData(query: any) {
  const params = new URLSearchParams(query);

  return await tabCardEndpoint.get(`/`, { params });
}

export async function findTabCardDataByClientId(id: string, query: any) {
  const params = new URLSearchParams(query);

  return await tabCardEndpoint.get(`/${id}`, { params });
}
