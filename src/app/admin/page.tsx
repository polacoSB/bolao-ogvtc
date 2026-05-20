"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const jogosBrasil = [
  "Brasil x Adversário 1",
  "Brasil x Adversário 2",
  "Brasil x Adversário 3",
];

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

export default function AdminPage() {
  const [codigo, setCodigo] = useState("");
  const [liberado, setLiberado] = useState(false);
  const [placares, setPlacares] = useState<any>({});
  const [apostas, setApostas] = useState<any[]>([]);
  const [classificados, setClassificados] = useState<any>({});

  useEffect(() => {
    if (liberado) {
      carregarResultados();
      carregarApostas();
      carregarClassificados();
    }
  }, [liberado]);

  function entrarAdmin() {
    if (codigo === "ogvtc2026") {
      setLiberado(true);
      return;
    }

    alert("Código admin incorreto");
  }

  async function carregarResultados() {
    const { data } = await supabase.from("resultados").select("*");

    const mapa: any = {};

    data?.forEach((r) => {
      mapa[r.jogo] = {
        brasil: String(r.gols_brasil),
        adversario: String(r.gols_adversario),
      };
    });

    setPlacares(mapa);
  }

  async function carregarApostas() {
    const { data } = await supabase
      .from("apostas")
      .select("*")
      .order("created_at", { ascending: false });

    setApostas(data || []);
  }

  async function carregarClassificados() {
    const { data } = await supabase
      .from("grupos_oficiais")
      .select("*");

    const mapa: any = {};

    data?.forEach((g) => {
      mapa[g.grupo] = {
        primeiro: g.primeiro,
        segundo: g.segundo,
      };
    });

    setClassificados(mapa);
  }

  async function salvarResultado(jogo: string) {
    const resultado = placares[jogo];

    const { error } = await supabase.from("resultados").upsert(
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
    await supabase.from("resultados").delete().eq("jogo", jogo);
    carregarResultados();
  }

  async function excluirAposta(id: string) {
    await supabase.from("apostas").delete().eq("id", id);
    carregarApostas();
  }

  async function salvarGrupo(grupo: string) {
    const dados = classificados[grupo];

    const { error } = await supabase
      .from("grupos_oficiais")
      .upsert(
        [
          {
            grupo,
            primeiro: dados.primeiro,
            segundo: dados.segundo,
          },
        ],
        {
          onConflict: "grupo",
        }
      );

    if (error) {
      alert("Erro ao salvar grupo");
      return;
    }

    alert("Grupo salvo 🏆");
    carregarClassificados();
  }

  function atualizarPlacar(jogo: string, campo: string, valor: string) {
    setPlacares((prev: any) => ({
      ...prev,
      [jogo]: {
        ...prev[jogo],
        [campo]: valor,
      },
    }));
  }

  function atualizarGrupo(grupo: string, campo: string, valor: string) {
    setClassificados((prev: any) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [campo]: valor,
      },
    }));
  }

  if (!liberado) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
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

      <div className="max-w-6xl mx-auto space-y-10">

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">⚽ Resultados</h2>

          {jogosBrasil.map((jogo) => (
            <div key={jogo} className="flex gap-4 items-center mb-4 flex-wrap">
              <span className="font-bold w-52">{jogo}</span>

              <input
                type="number"
                value={placares[jogo]?.brasil || ""}
                onChange={(e) =>
                  atualizarPlacar(jogo, "brasil", e.target.value)
                }
                className="w-20 border p-2 rounded-xl"
              />

              <span>X</span>

              <input
                type="number"
                value={placares[jogo]?.adversario || ""}
                onChange={(e) =>
                  atualizarPlacar(jogo, "adversario", e.target.value)
                }
                className="w-20 border p-2 rounded-xl"
              />

              <button
                onClick={() => salvarResultado(jogo)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Salvar
              </button>

              <button
                onClick={() => excluirResultado(jogo)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">🏆 Classificados Oficiais</h2>

          {grupos.map((grupoData) => (
            <div key={grupoData.grupo} className="mb-6">
              <h3 className="font-bold mb-2">{grupoData.grupo}</h3>

              <div className="flex gap-4 flex-wrap">
                <select
                  value={classificados[grupoData.grupo]?.primeiro || ""}
                  onChange={(e) =>
                    atualizarGrupo(grupoData.grupo, "primeiro", e.target.value)
                  }
                  className="border p-3 rounded-xl"
                >
                  <option value="">1º colocado</option>
                  {grupoData.times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>

                <select
                  value={classificados[grupoData.grupo]?.segundo || ""}
                  onChange={(e) =>
                    atualizarGrupo(grupoData.grupo, "segundo", e.target.value)
                  }
                  className="border p-3 rounded-xl"
                >
                  <option value="">2º colocado</option>
                  {grupoData.times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>

                <button
                  onClick={() => salvarGrupo(grupoData.grupo)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Salvar Grupo
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">📋 Apostas dos Jogadores</h2>

          {apostas.map((aposta) => (
            <div
              key={aposta.id}
              className="flex justify-between items-center border p-4 rounded-xl mb-3"
            >
              <div>
                <p className="font-bold">{aposta.jogador_nome}</p>
                <p>{aposta.jogo}</p>
                <p>{aposta.gols_brasil} x {aposta.gols_adversario}</p>
              </div>

              <button
                onClick={() => excluirAposta(aposta.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}