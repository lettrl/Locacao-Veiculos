import { useState, useEffect } from "react";
import api from "../services/api";

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [form, setForm] = useState({ marca: "", modelo: "", placa: "", ano: "", valorDiaria: "" });
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");

  async function carregar(disponiveis) {
    const { data } = await api.get("/veiculos", { params: disponiveis ? { disponiveis: true } : {} });
    setVeiculos(data);
  }

  useEffect(() => { carregar(somenteDisponiveis); }, [somenteDisponiveis]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSucesso("");
    setErro("");
    try {
      await api.post("/veiculos", {
        ...form,
        ano: Number(form.ano),
        valorDiaria: Number(form.valorDiaria),
      });
      setForm({ marca: "", modelo: "", placa: "", ano: "", valorDiaria: "" });
      setSucesso("Veículo cadastrado com sucesso!");
      await carregar(somenteDisponiveis);
    } catch (err) {
      setErro(err.response?.data?.message ?? "Erro ao cadastrar veículo");
    }
  }

  return (
    <div>
      <h2>Veículos</h2>

      <form onSubmit={handleSubmit}>
        <input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
        <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
        <input name="placa" placeholder="Placa" value={form.placa} onChange={handleChange} required />
        <input name="ano" placeholder="Ano" type="number" value={form.ano} onChange={handleChange} required />
        <input name="valorDiaria" placeholder="Valor da diária" type="number" step="0.01" value={form.valorDiaria} onChange={handleChange} required />
        <button type="submit">Cadastrar</button>
      </form>

      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <label>
        <input
          type="checkbox"
          checked={somenteDisponiveis}
          onChange={(e) => setSomenteDisponiveis(e.target.checked)}
        />
        {" "}Só disponíveis
      </label>

      <table>
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
          {veiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.placa}</td>
              <td>{v.ano}</td>
              <td>R$ {Number(v.valorDiaria).toFixed(2)}</td>
              <td>{v.disponivel ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
