export function Mensagem({ mensagem }) {
  if (!mensagem) return null;
  const erro = mensagem.tipo === "erro";
  return (
    <p role={erro ? "alert" : "status"} className={`mensagem ${erro ? "mensagem-erro" : "mensagem-sucesso"}`}>
      {mensagem.texto}
    </p>
  );
}
