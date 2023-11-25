import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/additions";

const additionsEndpoint = axios.create({
  baseURL: url,
});

additionsEndpoint.interceptors.request.use(
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

export async function findAdditionsOpenedByClientId(id: string, query: any) {
  const params = new URLSearchParams(query);

  return await additionsEndpoint.get(`/opened/${id}`, { params });
}

export async function findAdditionsOpened(query: any) {
  const params = new URLSearchParams(query);

  return await additionsEndpoint.get("/opened", { params });
}

export async function findAdditions(query: any) {
  const params = new URLSearchParams(query);

  return await additionsEndpoint.get("/", { params });
}

export async function filterAdditions(query: any) {
  const params = new URLSearchParams(query);

  return await additionsEndpoint.get("/filter", { params });
}

export async function addAddition(params: any) {
  return await additionsEndpoint.post("/add", params);
}

export async function deleteAddition(id: string) {
  return await additionsEndpoint.delete(`/delete/${id}`);
}
