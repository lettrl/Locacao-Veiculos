import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Layout } from "./components/Layout.jsx";
import { Login } from "./pages/Login.jsx";
import { Cadastro } from "./pages/Cadastro.jsx";
import { Locacoes } from "./pages/Locacoes.jsx";
import { Veiculos } from "./pages/Veiculos.jsx";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<Layout />}>
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/locacoes" element={<Locacoes />} />
          </Route>
          <Route path="*" element={<Navigate to="/veiculos" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
