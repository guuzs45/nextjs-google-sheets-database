import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");
  const [ip, setIp] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // Checa se os campos estão preenchidos
    if (!nome || !classe || !ip) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, classe, ip }),
      });

      if (response.ok) {
        setMessage("Inscrição enviada com sucesso!");
        setNome("");
        setClasse("");
        setIp("");
      } else {
        setMessage("Erro ao enviar inscrição.");
      }
    } catch (error) {
      setMessage("Erro ao enviar inscrição.");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h1>Inscrição para o Evento</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:<br />
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            />
        </label>
        <br /><br />
        <label>
          Classe:<br />
          <input
            type="text"
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            />
        </label>
        <br /><br />
        <label>
          IP:<br />
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            />
        </label>
        <br /><br />
        <button type="submit">Enviar</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
