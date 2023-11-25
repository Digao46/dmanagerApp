import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/discounts";

const discountsEndpoint = axios.create({
  baseURL: url,
});

discountsEndpoint.interceptors.request.use(
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

export async function findDiscounstByClientId(id: string, query: any) {
  const params = new URLSearchParams(query);

  return await discountsEndpoint.get(`/${id}`, { params });
}

export async function findDiscounts(query: any) {
  const params = new URLSearchParams(query);

  return await discountsEndpoint.get("/", { params });
}

export async function addDiscount(params: any) {
  return await discountsEndpoint.post("/add", params);
}

export async function deleteDiscount(id: string) {
  return await discountsEndpoint.delete(`/delete/${id}`);
}
