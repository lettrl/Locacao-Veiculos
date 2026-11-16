import { formatarDataHora, formatarMoeda } from "../utils/formatadores.js";

const ROTULO_STATUS = { ATIVA: "Ativa", FINALIZADA: "Finalizada" };

export function HistoricoLocacoes({ locacoes, finalizandoId, onFinalizar }) {
  if (locacoes.length === 0) {
    return <p className="vazio">Você ainda não tem locações.</p>;
  }

  return (
    <div className="tabela-rolagem">
      <table className="tabela">
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Início</th>
            <th>Devolução prevista</th>
            <th>Devolvido em</th>
            <th>Valor total</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((locacao) => (
            <tr key={locacao.id}>
              <td>
                {locacao.veiculo.marca} {locacao.veiculo.modelo}
                <span className="placa">{locacao.veiculo.placa}</span>
              </td>
              <td>{formatarDataHora(locacao.dataInicio)}</td>
              <td>{formatarDataHora(locacao.dataPrevistaDevolucao)}</td>
              <td>{formatarDataHora(locacao.dataDevolucao)}</td>
              <td>{formatarMoeda(locacao.valorTotal)}</td>
              <td>
                <span className={`status status-${locacao.status.toLowerCase()}`}>{ROTULO_STATUS[locacao.status]}</span>
              </td>
              <td>
                {locacao.status === "ATIVA" && (
                  <button type="button" onClick={() => onFinalizar(locacao.id)} disabled={finalizandoId === locacao.id}>
                    {finalizandoId === locacao.id ? "Finalizando..." : "Finalizar"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
