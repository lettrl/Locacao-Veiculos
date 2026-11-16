import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export function Layout() {
  const { autenticado, usuario, sair } = useAuth();

  if (!autenticado) return <Navigate to="/login" replace />;

  return (
    <>
      <header className="topo">
        <span className="marca">Locadora</span>
        <nav className="navegacao">
          <NavLink to="/locacoes">Locações</NavLink>
        </nav>
        <div className="usuario">
          <span>Olá, {usuario.nome}</span>
          <button type="button" className="botao-secundario" onClick={sair}>
            Sair
          </button>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  );
}
