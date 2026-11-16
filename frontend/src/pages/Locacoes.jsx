import { useCallback, useEffect, useState } from "react";
import { api, mensagemDeErro } from "../services/api.js";
import { formatarMoeda } from "../utils/formatadores.js";
import { Mensagem } from "../components/Mensagem.jsx";
import { FormLocacao } from "../components/FormLocacao.jsx";
import { HistoricoLocacoes } from "../components/HistoricoLocacoes.jsx";

export function Locacoes() {
  const [veiculos, setVeiculos] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [finalizandoId, setFinalizandoId] = useState(null);

  const carregar = useCallback(async () => {
    try {
      const [respostaVeiculos, respostaLocacoes] = await Promise.all([
        api.get("/veiculos", { params: { disponiveis: true } }),
        api.get("/locacoes"),
      ]);
      setVeiculos(respostaVeiculos.data);
      setLocacoes(respostaLocacoes.data);
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function registrar(dados) {
    setMensagem(null);
    try {
      const { data } = await api.post("/locacoes", dados);
      setMensagem({
        tipo: "sucesso",
        texto: `Locação registrada: ${data.veiculo.marca} ${data.veiculo.modelo}, total ${formatarMoeda(data.valorTotal)}.`,
      });
      await carregar();
      return true;
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
      return false;
    }
  }

  async function finalizar(id) {
    setMensagem(null);
    setFinalizandoId(id);
    try {
      await api.patch(`/locacoes/${id}/finalizar`);
      setMensagem({ tipo: "sucesso", texto: "Locação finalizada. O veículo está disponível de novo." });
      await carregar();
    } catch (erro) {
      setMensagem({ tipo: "erro", texto: mensagemDeErro(erro) });
    } finally {
      setFinalizandoId(null);
    }
  }

  return (
    <section className="pagina">
      <h1>Locações</h1>
      <Mensagem mensagem={mensagem} />
      {carregando ? (
        <p className="vazio">Carregando...</p>
      ) : (
        <>
          <FormLocacao veiculos={veiculos} onRegistrar={registrar} />
          <h2>Histórico</h2>
          <HistoricoLocacoes locacoes={locacoes} finalizandoId={finalizandoId} onFinalizar={finalizar} />
        </>
      )}
    </section>
  );
}
