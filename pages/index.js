import { useState, useEffect, useRef } from "react";

function ClassDropdown({ options, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const images = {
    "OFF TANK": "/icons/offtank.png",
    "ARCANO ELEVADO": "/icons/arcano_elevado.png",
    "ARCANO SILENCE": "/icons/arcano_silence.png",
    "MAIN HEALER": "/icons/main_healer.png",
    "RAIZ FERREA": "/icons/raiz_ferrea.png",
    "QUEBRAREINOS": "/icons/quebrareinos.png",
    "INCUBO": "/icons/incubo.png",
    "BRUXO": "/icons/bruxo.png",
    "DPS - Frost": "/icons/dps_frost.png",
    "DPS - Fire": "/icons/dps_fire.png",
    "DPS - Aguia": "/icons/dps_aguia.png",
    "DPS - Xbow": "/icons/dps_xbow.png",
  };

  const selectedOption = options.find((opt) => opt === value);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        userSelect: "none",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: disabled ? "#eee" : "white",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "250px",    // largura máxima para dropdown fechado
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
      onClick={() => {
        if (!disabled) setIsOpen(!isOpen);
      }}
    >
      {selectedOption ? (
        <>
          <img
            src={images[selectedOption]}
            alt={selectedOption}
            style={{ width: 20, height: 20, objectFit: "contain" }}
          />
          <span>{selectedOption}</span>
        </>
      ) : (
        <span style={{ color: "#888" }}>Selecione a classe</span>
      )}

      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: 4,
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 1000,
            listStyle: "none",
            padding: 0,
            maxWidth: "250px",  // largura máxima para o menu aberto
          }}
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                cursor: "pointer",
                backgroundColor: option === value ? "#0070f3" : "white",
                color: option === value ? "white" : "black",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eee")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  option === value ? "#0070f3" : "white")
              }
            >
              <img
                src={images[option]}
                alt={option}
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");
  const [ip, setIp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const classesOptions = [
    "OFF TANK", "ARCANO ELEVADO", "ARCANO SILENCE", "MAIN HEALER",
    "RAIZ FERREA", "QUEBRAREINOS", "INCUBO", "BRUXO",
    "DPS - Frost", "DPS - Fire", "DPS - Aguia", "DPS - Xbow"
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome || !classe || !ip) {
      setMessage("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    setMessage("Enviando...");
    setAlreadySubmitted(false);
    setCopySuccess("");

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
        setAlreadySubmitted(true);
      } else {
        setMessage("Erro ao enviar inscrição.");
      }
    } catch (error) {
      setMessage("Erro ao enviar inscrição.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyCommand() {
    navigator.clipboard.writeText("#forcecityoverload true")
      .then(() => {
        setCopySuccess("✅ Comando copiado!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(() => {
        setCopySuccess("❌ Falha ao copiar.");
      });
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
            <ClassDropdown
              options={classesOptions}
              value={classe}
              onChange={setClasse}
              disabled={isSubmitting}
            />
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
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: "20px",
            textAlign: "center",
            color: message.includes("sucesso") ? "green" : "red"
          }}>
            {message}
          </p>
        )}

        {alreadySubmitted && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>Copie o comando abaixo e envie no chat do jogo:</p>
            <div style={{
              margin: "10px auto",
              padding: "12px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "16px",
              maxWidth: "280px",
              userSelect: "all"
            }}>
              #forcecityoverload true
            </div>
            <button
              onClick={copyCommand}
              style={{
                marginTop: "8px",
                padding: "8px 16px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Copiar Comando
            </button>
            {copySuccess && (
              <p style={{ marginTop: "8px", color: "green" }}>{copySuccess}</p>
            )}
          </div>
        )}
      </div>

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
