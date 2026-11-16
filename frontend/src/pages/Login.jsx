import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { mensagemDeErro } from "../services/api.js";
import { Mensagem } from "../components/Mensagem.jsx";

export function Login() {
  const { autenticado, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [mensagem, setMensagem] = useState(location.state?.mensagem ?? null);
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
      await entrar(form.email, form.senha);
      navigate("/locacoes", { replace: true });
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
      setEnviando(false);
    }
  }

  return (
    <main className="pagina-auth">
      <form className="cartao formulario" onSubmit={enviar}>
        <h1>Entrar</h1>
        <Mensagem mensagem={mensagem} />
        <label>
          E-mail
          <input type="email" name="email" value={form.email} onChange={alterar} required autoComplete="email" />
        </label>
        <label>
          Senha
          <input type="password" name="senha" value={form.senha} onChange={alterar} required autoComplete="current-password" />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
        <p className="rodape-form">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </main>
  );
}
