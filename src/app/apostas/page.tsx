"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const jogosBrasil = [
  { id: 1, jogo: "Brasil x Adversário 1" },
  { id: 2, jogo: "Brasil x Adversário 2" },
  { id: 3, jogo: "Brasil x Adversário 3" },
];

export default function ApostasPage() {
  const [placares, setPlacares] = useState<{
    [key: string]: { brasil: string; adversario: string };
  }>({});

  async function salvarPalpite(jogo: string) {
    const jogador = localStorage.getItem("nomeJogador");

    if (!jogador) {
      alert("Jogador não encontrado");
      return;
    }

    const palpite = placares[jogo];

    if (!palpite || palpite.brasil === "" || palpite.adversario === "") {
      alert("Preencha os dois placares");
      return;
    }

    const { error } = await supabase.from("apostas").insert([
      {
        jogador_nome: jogador,
        jogo,
        gols_brasil: Number(palpite.brasil),
        gols_adversario: Number(palpite.adversario),
      },
    ]);

    if (error) {
      alert("Você já apostou nesse jogo 😄");
      return;
    }

    alert("Palpite salvo com sucesso ⚽");
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

  return (
    <main className="min-h-screen bg-green-700 p-6">
      <nav className="flex justify-center gap-4 mb-10 flex-wrap">
        <Link
          href="/apostas"
          className="bg-yellow-400 px-6 py-3 rounded-2xl font-bold"
        >
          ⚽ Jogos do Brasil
        </Link>

        <Link
          href="/grupos"
          className="bg-white px-6 py-3 rounded-2xl font-bold"
        >
          🏆 Classificados
        </Link>

        <Link
          href="/ranking"
          className="bg-white px-6 py-3 rounded-2xl font-bold"
        >
          📊 Ranking
        </Link>
      </nav>

      <h1 className="text-5xl font-bold text-white text-center mb-10">
        ⚽ Jogos do Brasil
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {jogosBrasil.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">{item.jogo}</h2>

            <div className="flex justify-center gap-6 items-center">
              <input
                type="number"
                className="w-20 h-20 text-center text-3xl border rounded-xl"
                onChange={(e) =>
                  atualizarPlacar(item.jogo, "brasil", e.target.value)
                }
              />

              <span className="text-4xl font-bold">X</span>

              <input
                type="number"
                className="w-20 h-20 text-center text-3xl border rounded-xl"
                onChange={(e) =>
                  atualizarPlacar(item.jogo, "adversario", e.target.value)
                }
              />
            </div>

            <button
              onClick={() => salvarPalpite(item.jogo)}
              className="mt-6 bg-yellow-400 px-8 py-4 rounded-2xl text-xl font-bold"
            >
              Salvar Palpite ⚽
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}