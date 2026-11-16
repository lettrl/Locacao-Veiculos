import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

let token = null;
let aoExpirarSessao = () => {};

export function definirToken(novoToken) {
  token = novoToken;
}

export function definirAoExpirarSessao(callback) {
  aoExpirarSessao = callback;
}

api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401 && token) aoExpirarSessao();
    return Promise.reject(erro);
  }
);

export function mensagemDeErro(erro) {
  return erro.response?.data?.erro ?? "Não foi possível conectar à API";
}
