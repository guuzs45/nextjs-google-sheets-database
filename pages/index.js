import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");
  const [ip, setIp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesOptions = [
    "OFF TANK", "ARCANO ELEVADO", "ARCANO SILENCE", "MAIN HEALER",
    "RAIZ FERREA", "QUEBRAREINOS", "INCUBO", "BRUXO",
    "DPS - Frost", "DPS - Fire", "DPS - Aguia", "DPS - Xbow"
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome || !classe || !ip) {
      toast.warn("⚠️ Preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, classe, ip }),
      });

      if (response.ok) {
        toast.success("✅ Inscrição enviada com sucesso!");
        setNome("");
        setClasse("");
        setIp("");
      } else {
        toast.error("❌ Erro ao enviar inscrição.");
      }
    } catch (error) {
      toast.error("❌ Erro na conexão.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>DG Avalon - Neve Eterna</h1>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box"
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "8px" }}>
            Classe:
            <select
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box"
              }}
            >
              <option value="">Selecione a classe</option>
              {classesOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "8px" }}>
            IP:
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box"
              }}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "10px",
              backgroundColor: isSubmitting ? "#aaa" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {isSubmitting ? "🔄 Enviando..." : "Enviar"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />

      <footer style={{
        marginTop: "20px",
        textAlign: "center",
        fontSize: "12px",
        color: "#888"
      }}>
        Desenvolvido por Guuzs
      </footer>
    </>
  );
}
