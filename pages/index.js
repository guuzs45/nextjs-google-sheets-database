import { useState, useRef, useEffect } from "react";

const classesOptions = [
  { value: "OFF TANK", label: "OFF TANK", img: "/icons/offtank.png" },
  { value: "ARCANO ELEVADO", label: "ARCANO ELEVADO", img: "/icons/arcanoelevado.png" },
  { value: "ARCANO SILENCE", label: "ARCANO SILENCE", img: "/icons/arcanosilence.png" },
  { value: "MAIN HEALER", label: "MAIN HEALER", img: "/icons/mainhealer.png" },
  { value: "RAIZ FERREA", label: "RAIZ FERREA", img: "/icons/raizferrea.png" },
  { value: "QUEBRAREINOS", label: "QUEBRAREINOS", img: "/icons/quebrareinos.png" },
  { value: "INCUBO", label: "INCUBO", img: "/icons/incubo.png" },
  { value: "BRUXO", label: "BRUXO", img: "/icons/bruxo.png" },
  { value: "DPS - Frost", label: "DPS - Frost", img: "/icons/dpsfrost.png" },
  { value: "DPS - Fire", label: "DPS - Fire", img: "/icons/dpsfire.png" },
  { value: "DPS - Aguia", label: "DPS - Aguia", img: "/icons/dpsaguia.png" },
  { value: "DPS - Xbow", label: "DPS - Xbow", img: "/icons/dpsxbow.png" },
];

export default function ClasseDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Fecha dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = classesOptions.find(opt => opt.value === value);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        userSelect: "none",
        width: "100%",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Caixa que mostra a opção selecionada */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "8px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "#fff",
        }}
      >
        {selectedOption ? (
          <>
            <img
              src={selectedOption.img}
              alt={selectedOption.label}
              style={{ width: 24, height: 24, marginRight: 8, objectFit: "contain" }}
            />
            <span>{selectedOption.label}</span>
          </>
        ) : (
          <span style={{ color: "#888" }}>Selecione a classe</span>
        )}
        <span style={{ marginLeft: "auto" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Lista dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 4,
            backgroundColor: "#fff",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {classesOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px",
                cursor: "pointer",
                backgroundColor: value === opt.value ? "#0070f3" : "#fff",
                color: value === opt.value ? "#fff" : "#000",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0070f3"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = value === opt.value ? "#0070f3" : "#fff"}
            >
              <img
                src={opt.img}
                alt={opt.label}
                style={{ width: 24, height: 24, marginRight: 8, objectFit: "contain" }}
              />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
