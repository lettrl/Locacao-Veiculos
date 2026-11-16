import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, definirAoExpirarSessao, definirToken } from "../services/api.js";

const CHAVE_SESSAO = "locadora.sessao";

const AuthContext = createContext(null);

function lerSessaoSalva() {
  try {
    const sessao = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
    return sessao?.token && sessao?.usuario ? sessao : null;
  } catch {
    return null;
  }
}

function salvarSessao(sessao) {
  try {
    if (sessao) sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    else sessionStorage.removeItem(CHAVE_SESSAO);
  } catch (erro) {
    console.warn("Sessão não persistida no navegador", erro);
  }
}

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(() => {
    const salva = lerSessaoSalva();
    definirToken(salva?.token ?? null);
    return salva;
  });

  const sair = useCallback(() => {
    definirToken(null);
    salvarSessao(null);
    setSessao(null);
  }, []);

  useEffect(() => {
    definirAoExpirarSessao(sair);
  }, [sair]);

  const entrar = useCallback(async (email, senha) => {
    const { data } = await api.post("/auth/login", { email, senha });
    definirToken(data.token);
    salvarSessao(data);
    setSessao(data);
  }, []);

  const valor = useMemo(
    () => ({ usuario: sessao?.usuario ?? null, autenticado: Boolean(sessao), entrar, sair }),
    [sessao, entrar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return contexto;
}
