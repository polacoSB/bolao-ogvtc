"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const jogosFixos = [
  { id: 1, casa: "Brasil", fora: "Adversário 1" },
  { id: 2, casa: "Brasil", fora: "Adversário 2" },
  { id: 3, casa: "Brasil", fora: "Adversário 3" },
];

export default function AdminPage() {
  const [senha, setSenha] = useState("");
  const [autorizado, setAutorizado] = useState(false);
  const [resultados, setResultados] = useState<any>({});

  function entrarAdmin() {
    if (senha === "admin123") {
      setAutorizado(true);
      carregarResultados();
    } else {
      alert("Senha incorreta");
    }
  }

  async function carregarResultados() {
    const { data, error } = await supabase.from("resultados").select("*");

    if (error) {
      console.error(error);
      return;
    }

    const mapa: any = {};
    data.forEach((r) => {
      mapa[r.jogo_id] = r;
    });

    setResultados(mapa);
  }

  async function salvarResultado(jogoId: number) {
    const placarCasa = resultados[jogoId]?.placar_casa || 0;
    const placarFora = resultados[jogoId]?.placar_fora || 0;

    const { error } = await supabase.from("resultados").upsert({
      jogo_id: jogoId,
      placar_casa: Number(placarCasa),
      placar_fora: Number(placarFora),
    });

    if (error) {
      console.error(error);
      alert("Erro ao salvar resultado");
      return;
    }

    alert("Resultado salvo com sucesso");
    carregarResultados();
  }

  async function excluirResultado(jogoId: number) {
    const { error } = await supabase
      .from("resultados")
      .delete()
      .eq("jogo_id", jogoId);

    if (error) {
      console.error(error);
      alert("Erro ao excluir resultado");
      return;
    }

    alert("Resultado excluído com sucesso");
    carregarResultados();
  }

  function atualizarPlacar(
    jogoId: number,
    campo: "placar_casa" | "placar_fora",
    valor: string
  ) {
    setResultados((prev: any) => ({
      ...prev,
      [jogoId]: {
        ...prev[jogoId],
        [campo]: valor,
      },
    }));
  }

  if (!autorizado) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#00b140",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            gap: 15,
            width: 320,
          }}
        >
          <h2>Área Admin</h2>

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={entrarAdmin}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: "#008f32",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#00b140",
        padding: 30,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: 30,
        }}
      >
        Administração de Resultados
      </h1>

      {jogosFixos.map((jogo) => (
        <div
          key={jogo.id}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 20,
            marginBottom: 20,
            maxWidth: 700,
            marginInline: "auto",
          }}
        >
          <h2>
            {jogo.casa} x {jogo.fora}
          </h2>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="number"
              value={resultados[jogo.id]?.placar_casa || ""}
              onChange={(e) =>
                atualizarPlacar(jogo.id, "placar_casa", e.target.value)
              }
              style={{
                padding: 10,
                width: 80,
                borderRadius: 10,
                border: "1px solid #ccc",
              }}
            />

            <span>X</span>

            <input
              type="number"
              value={resultados[jogo.id]?.placar_fora || ""}
              onChange={(e) =>
                atualizarPlacar(jogo.id, "placar_fora", e.target.value)
              }
              style={{
                padding: 10,
                width: 80,
                borderRadius: 10,
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={() => salvarResultado(jogo.id)}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#008f32",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Salvar Resultado
            </button>

            <button
              onClick={() => excluirResultado(jogo.id)}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#d62828",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Excluir Resultado
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}