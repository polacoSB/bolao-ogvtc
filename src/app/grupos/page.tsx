"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const grupos = [
  "Grupo A",
  "Grupo B",
  "Grupo C",
  "Grupo D",
  "Grupo E",
  "Grupo F",
  "Grupo G",
  "Grupo H",
  "Grupo I",
  "Grupo J",
  "Grupo K",
  "Grupo L",
];

export default function GruposPage() {
  const [dados, setDados] = useState<{
    [key: string]: { primeiro: string; segundo: string };
  }>({});

  async function salvarGrupo(grupo: string) {
    const jogador = localStorage.getItem("nomeJogador");

    if (!jogador) {
      alert("Jogador não encontrado");
      return;
    }

    const info = dados[grupo];

    if (!info?.primeiro || !info?.segundo) {
      alert("Preencha primeiro e segundo colocado");
      return;
    }

    const { error } = await supabase.from("classificacoes").insert([
      {
        jogador_nome: jogador,
        grupo,
        primeiro: info.primeiro,
        segundo: info.segundo,
      },
    ]);

    if (error) {
      alert("Você já salvou esse grupo 😄");
      return;
    }

    alert("Grupo salvo com sucesso 🏆");
  }

  function atualizar(
    grupo: string,
    campo: "primeiro" | "segundo",
    valor: string
  ) {
    setDados((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [campo]: valor,
      },
    }));
  }

  return (
    <main className="min-h-screen bg-blue-700 p-6">
      <h1 className="text-5xl font-bold text-white text-center mb-10">
        🏆 Classificados dos Grupos
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {grupos.map((grupo) => (
          <div
            key={grupo}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-4">{grupo}</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="1º colocado"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  atualizar(grupo, "primeiro", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="2º colocado"
                className="border p-3 rounded-xl"
                onChange={(e) =>
                  atualizar(grupo, "segundo", e.target.value)
                }
              />
            </div>

            <button
              onClick={() => salvarGrupo(grupo)}
              className="mt-4 bg-yellow-400 px-6 py-3 rounded-xl font-bold"
            >
              Salvar Grupo 🏆
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}