import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { api, mensagemDeErro } from "../services/api.js";
import { Mensagem } from "../components/Mensagem.jsx";

const SENHA_MINIMA = 6;

export function Cadastro() {
  const { autenticado } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [mensagem, setMensagem] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (autenticado) return <Navigate to="/locacoes" replace />;

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setMensagem(null);
    try {
      await api.post("/auth/registrar", form);
      navigate("/login", {
        state: { mensagem: { tipo: "sucesso", texto: "Cadastro realizado. Faça login para continuar." } },
      });
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
      setEnviando(false);
    }
  }

  return (
    <main className="pagina-auth">
      <form className="cartao formulario" onSubmit={enviar}>
        <h1>Criar conta</h1>
        <Mensagem mensagem={mensagem} />
        <label>
          Nome
          <input name="nome" value={form.nome} onChange={alterar} required autoComplete="name" />
        </label>
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={alterar} required autoComplete="email" />
        </label>
        <label>
          Senha
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={alterar}
            required
            minLength={SENHA_MINIMA}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? "Cadastrando..." : "Cadastrar"}
        </button>
        <p className="rodape-form">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
