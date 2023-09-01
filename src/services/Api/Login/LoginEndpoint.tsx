import axios from "axios";

const url = process.env.REACT_APP_URL;

const loginEndpoint = axios.create({
  baseURL: url,
});

export async function logIn(user: any) {
  return await loginEndpoint.post("/login", {
    ...user,
  });
}
