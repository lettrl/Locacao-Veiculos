import { useState } from "react";
import { formatarMoeda } from "../utils/formatadores.js";

const FORM_VAZIO = { veiculoId: "", dataInicio: "", dataPrevistaDevolucao: "" };

export function FormLocacao({ veiculos, onRegistrar }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const semVeiculos = veiculos.length === 0;

  function alterar(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    const registrou = await onRegistrar({
      veiculoId: Number(form.veiculoId),
      dataInicio: new Date(form.dataInicio).toISOString(),
      dataPrevistaDevolucao: new Date(form.dataPrevistaDevolucao).toISOString(),
    });
    setEnviando(false);
    if (registrou) setForm(FORM_VAZIO);
  }

  return (
    <form className="cartao formulario" onSubmit={enviar}>
      <h2>Nova locação</h2>
      <label>
        Veículo
        <select name="veiculoId" value={form.veiculoId} onChange={alterar} required disabled={semVeiculos}>
          <option value="">{semVeiculos ? "Nenhum veículo disponível" : "Selecione um veículo"}</option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} {veiculo.modelo} ({veiculo.placa}) - {formatarMoeda(veiculo.valorDiaria)}/dia
            </option>
          ))}
        </select>
      </label>
      <div className="linha">
        <label>
          Início
          <input type="datetime-local" name="dataInicio" value={form.dataInicio} onChange={alterar} required />
        </label>
        <label>
          Devolução prevista
          <input
            type="datetime-local"
            name="dataPrevistaDevolucao"
            value={form.dataPrevistaDevolucao}
            onChange={alterar}
            min={form.dataInicio || undefined}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={enviando || semVeiculos}>
        {enviando ? "Registrando..." : "Registrar locação"}
      </button>
    </form>
  );
}
