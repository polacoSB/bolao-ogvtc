"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const jogosBrasil = [
  "Brasil x Adversário 1",
  "Brasil x Adversário 2",
  "Brasil x Adversário 3",
];

export default function AdminPage() {
  const [codigo, setCodigo] = useState("");
  const [liberado, setLiberado] = useState(false);
  const [placares, setPlacares] = useState<{
    [key: string]: { brasil: string; adversario: string };
  }>({});

  function entrarAdmin() {
    if (codigo === "ogvtc2026") {
      setLiberado(true);
      carregarResultados();
      return;
    }

    alert("Código admin incorreto");
  }

  async function carregarResultados() {
    const { data, error } = await supabase
      .from("resultados")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    const novosPlacares: {
      [key: string]: { brasil: string; adversario: string };
    } = {};

    data?.forEach((resultado) => {
      novosPlacares[resultado.jogo] = {
        brasil: String(resultado.gols_brasil),
        adversario: String(resultado.gols_adversario),
      };
    });

    setPlacares(novosPlacares);
  }

  async function salvarResultado(jogo: string) {
    const resultado = placares[jogo];

    if (!resultado?.brasil || !resultado?.adversario) {
      alert("Preencha os placares");
      return;
    }

    const { error } = await supabase
      .from("resultados")
      .upsert(
        [
          {
            jogo,
            gols_brasil: Number(resultado.brasil),
            gols_adversario: Number(resultado.adversario),
          },
        ],
        {
          onConflict: "jogo",
        }
      );

    if (error) {
      alert("Erro ao salvar");
      return;
    }

    alert("Resultado salvo ⚽");
    carregarResultados();
  }

  async function excluirResultado(jogo: string) {
    const { error } = await supabase
      .from("resultados")
      .delete()
      .eq("jogo", jogo);

    if (error) {
      alert("Erro ao excluir");
      return;
    }

    alert("Resultado excluído 🗑️");
    carregarResultados();
  }

  function atualizarPlacar(
    jogo: string,
    time: "brasil" | "adversario",
    valor: string
  ) {
    setPlacares((prev) => ({
      ...prev,
      [jogo]: {
        ...prev[jogo],
        [time]: valor,
      },
    }));
  }

  if (!liberado) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            🔐 Painel Admin
          </h1>

          <input
            type="password"
            placeholder="Código admin"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <button
            onClick={entrarAdmin}
            className="w-full bg-black text-white p-3 rounded-xl font-bold"
          >
            Entrar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-center mb-10">
        🔐 Painel Admin
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {jogosBrasil.map((jogo) => (
          <div
            key={jogo}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-4">{jogo}</h2>

            <div className="flex gap-4 items-center flex-wrap">
              <input
                type="number"
                placeholder="Brasil"
                value={placares[jogo]?.brasil || ""}
                onChange={(e) =>
                  atualizarPlacar(jogo, "brasil", e.target.value)
                }
                className="w-24 border p-3 rounded-xl"
              />

              <span className="text-2xl font-bold">X</span>

              <input
                type="number"
                placeholder="Adversário"
                value={placares[jogo]?.adversario || ""}
                onChange={(e) =>
                  atualizarPlacar(jogo, "adversario", e.target.value)
                }
                className="w-24 border p-3 rounded-xl"
              />

              <button
                onClick={() => salvarResultado(jogo)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Salvar
              </button>

              <button
                onClick={() => excluirResultado(jogo)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}