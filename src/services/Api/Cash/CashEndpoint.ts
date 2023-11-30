import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/cash";

const cashEndpoint = axios.create({
  baseURL: url,
});

cashEndpoint.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")!);
    config.headers!.Authorization = `Bearer ${user.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function findCashData(query: any) {
  const params = new URLSearchParams(query);

  return await cashEndpoint.get("/", { params });
}
