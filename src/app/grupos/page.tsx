"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const grupos = [
  {
    grupo: "Grupo A",
    times: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
  },
  {
    grupo: "Grupo B",
    times: ["Canadá", "Bósnia", "Catar", "Suíça"],
  },
  {
    grupo: "Grupo C",
    times: ["Brasil", "Marrocos", "Haiti", "Escócia"],
  },
  {
    grupo: "Grupo D",
    times: ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
  },
  {
    grupo: "Grupo E",
    times: ["Alemanha", "Curaçao", "Costa do Marfim", "Equador"],
  },
  {
    grupo: "Grupo F",
    times: ["Holanda", "Japão", "Suécia", "Tunísia"],
  },
  {
    grupo: "Grupo G",
    times: ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
  },
  {
    grupo: "Grupo H",
    times: ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
  },
  {
    grupo: "Grupo I",
    times: ["França", "Senegal", "Bolívia/Iraque", "Noruega"],
  },
  {
    grupo: "Grupo J",
    times: ["Argentina", "Argélia", "Áustria", "Jordânia"],
  },
  {
    grupo: "Grupo K",
    times: ["Portugal", "RD Congo", "Uzbequistão", "Colômbia"],
  },
  {
    grupo: "Grupo L",
    times: ["Inglaterra", "Croácia", "Gana", "Panamá"],
  },
];

export default function GruposPage() {
  const [nome, setNome] = useState("");
  const [palpites, setPalpites] = useState<{
    [key: string]: {
      primeiro: string;
      segundo: string;
    };
  }>({});

  function atualizarPalpite(
    grupo: string,
    campo: "primeiro" | "segundo",
    valor: string
  ) {
    setPalpites((prev) => ({
      ...prev,
      [grupo]: {
        primeiro: prev[grupo]?.primeiro || "",
        segundo: prev[grupo]?.segundo || "",
        [campo]: valor,
      },
    }));
  }

  async function salvarGrupo(grupo: string) {
    if (!nome.trim()) {
      alert("Digite seu nome");
      return;
    }

    const palpite = palpites[grupo];

    if (!palpite?.primeiro || !palpite?.segundo) {
      alert("Escolha os dois classificados");
      return;
    }

    if (palpite.primeiro === palpite.segundo) {
      alert("Escolha times diferentes");
      return;
    }

    const { error } = await supabase
      .from("classificacoes")
      .insert([
        {
          jogador_nome: nome.trim(),
          grupo,
          primeiro: palpite.primeiro,
          segundo: palpite.segundo,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Erro ao salvar");
      return;
    }

    alert(`${grupo} salvo com sucesso 🏆`);
  }

  return (
    <main className="min-h-screen bg-blue-700 p-6">
      <h1 className="text-5xl font-bold text-center text-white mb-10">
        🏆 Classificados dos Grupos
      </h1>

      <div className="max-w-6xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-4 rounded-2xl border text-xl"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {grupos.map((grupoData) => (
          <div
            key={grupoData.grupo}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6">
              {grupoData.grupo}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={palpites[grupoData.grupo]?.primeiro || ""}
                onChange={(e) =>
                  atualizarPalpite(
                    grupoData.grupo,
                    "primeiro",
                    e.target.value
                  )
                }
                className="p-4 rounded-2xl border text-lg"
              >
                <option value="">1º colocado</option>
                {grupoData.times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              <select
                value={palpites[grupoData.grupo]?.segundo || ""}
                onChange={(e) =>
                  atualizarPalpite(
                    grupoData.grupo,
                    "segundo",
                    e.target.value
                  )
                }
                className="p-4 rounded-2xl border text-lg"
              >
                <option value="">2º colocado</option>
                {grupoData.times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => salvarGrupo(grupoData.grupo)}
              className="mt-6 bg-yellow-500 text-white px-8 py-4 rounded-2xl font-bold text-lg"
            >
              Salvar Grupo 🏆
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}