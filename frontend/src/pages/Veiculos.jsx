import { useCallback, useEffect, useState } from "react";
import { api, mensagemDeErro } from "../services/api.js";
import { formatarMoeda } from "../utils/formatadores.js";
import { Mensagem } from "../components/Mensagem.jsx";

export function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [form, setForm] = useState({ marca: "", modelo: "", placa: "", ano: "", valorDiaria: "" });
  const [mensagem, setMensagem] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const { data } = await api.get("/veiculos", {
        params: somenteDisponiveis ? { disponiveis: true } : {},
      });
      setVeiculos(data);
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
    }
  }, [somenteDisponiveis]);

  useEffect(() => { carregar(); }, [carregar]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem(null);
    try {
      await api.post("/veiculos", {
        ...form,
        ano: Number(form.ano),
        valorDiaria: Number(form.valorDiaria),
      });
      setForm({ marca: "", modelo: "", placa: "", ano: "", valorDiaria: "" });
      setMensagem({ tipo: "sucesso", texto: "Veículo cadastrado com sucesso!" });
      await carregar();
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
    }
  }

  return (
    <section className="pagina">
      <h1>Veículos</h1>
      <Mensagem mensagem={mensagem} />

      <form className="formulario" onSubmit={handleSubmit}>
        <input className="campo" name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
        <input className="campo" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
        <input className="campo" name="placa" placeholder="Placa" value={form.placa} onChange={handleChange} required />
        <input className="campo" name="ano" placeholder="Ano" type="number" value={form.ano} onChange={handleChange} required />
        <input className="campo" name="valorDiaria" placeholder="Valor da diária" type="number" step="0.01" value={form.valorDiaria} onChange={handleChange} required />
        <button className="botao-primario" type="submit">Cadastrar</button>
      </form>

      <label className="filtro">
        <input
          type="checkbox"
          checked={somenteDisponiveis}
          onChange={(e) => setSomenteDisponiveis(e.target.checked)}
        />
        {" "}Só disponíveis
      </label>

      <table className="tabela">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Disponível</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.length === 0 ? (
            <tr>
              <td colSpan={6} className="vazio">Nenhum veículo encontrado.</td>
            </tr>
          ) : (
            veiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.placa}</td>
                <td>{v.ano}</td>
                <td>{formatarMoeda(v.valorDiaria)}</td>
                <td>{v.disponivel ? "Sim" : "Não"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
