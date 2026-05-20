"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type JogadorPontuacao = {
  nome: string;
  pontos: number;
};

export default function RankingPage() {
  const [ranking, setRanking] = useState<JogadorPontuacao[]>([]);

  useEffect(() => {
    async function calcularRanking() {
      const { data: jogadores } = await supabase.from("jogadores").select("*");
      const { data: apostas } = await supabase.from("apostas").select("*");
      const { data: resultados } = await supabase.from("resultados").select("*");

      if (!jogadores || !apostas || !resultados) return;

      const rankingCalculado = jogadores.map((jogador) => {
        let pontos = 0;

        const apostasJogador = apostas.filter(
          (aposta) => aposta.jogador_nome === jogador.nome
        );

        apostasJogador.forEach((aposta) => {
          const resultado = resultados.find(
            (res) => res.jogo === aposta.jogo
          );

          if (!resultado) return;

          const placarExato =
            aposta.gols_brasil === resultado.gols_brasil &&
            aposta.gols_adversario === resultado.gols_adversario;

          if (placarExato) {
            pontos += 2;
            return;
          }

          const vencedorAposta =
            aposta.gols_brasil > aposta.gols_adversario
              ? "brasil"
              : aposta.gols_brasil < aposta.gols_adversario
              ? "adversario"
              : "empate";

          const vencedorResultado =
            resultado.gols_brasil > resultado.gols_adversario
              ? "brasil"
              : resultado.gols_brasil < resultado.gols_adversario
              ? "adversario"
              : "empate";

          if (vencedorAposta === vencedorResultado) {
            pontos += 1;
          }
        });

        return {
          nome: jogador.nome,
          pontos,
        };
      });

      rankingCalculado.sort((a, b) => b.pontos - a.pontos);

      setRanking(rankingCalculado);
    }

    calcularRanking();
  }, []);

  return (
    <main className="min-h-screen bg-purple-700 p-6">
      <nav className="flex justify-center gap-4 mb-10 flex-wrap">
        <Link
          href="/apostas"
          className="bg-white px-6 py-3 rounded-2xl font-bold"
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
          className="bg-yellow-400 px-6 py-3 rounded-2xl font-bold"
        >
          📊 Ranking
        </Link>
      </nav>

      <h1 className="text-5xl font-bold text-white text-center mb-10">
        🏆 Ranking Oficial
      </h1>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {ranking.length === 0 ? (
          <p className="text-center text-xl">Sem pontuação ainda</p>
        ) : (
          ranking.map((jogador, index) => (
            <div
              key={jogador.nome}
              className="flex justify-between border-b py-4 text-xl"
            >
              <span>
                {index + 1}º - {jogador.nome}
              </span>
              <span>{jogador.pontos} pts</span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}