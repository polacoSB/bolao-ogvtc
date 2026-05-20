"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");

  async function validarEntrada() {
    if (!nome.trim()) {
      alert("Digite seu nome!");
      return;
    }

    if (codigo !== "OGVTC2026") {
      alert("Código incorreto!");
      return;
    }

    const { error } = await supabase
      .from("jogadores")
      .insert([{ nome }]);

    if (error) {
      alert("Erro ao entrar no bolão");
      console.log(error);
      return;
    }

    localStorage.setItem("nomeJogador", nome);
    window.location.href = "/apostas";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-500 to-green-800 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-6xl font-extrabold mb-3">⚽ Bolão do OGVTC</h1>

      <p className="text-xl mb-10 text-center">
        Faça seus palpites da Copa do Mundo 2026
      </p>

      <div className="bg-white text-black rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        <input
          type="password"
          placeholder="Código do bolão"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full border p-3 rounded-xl mb-6"
        />

        <button
          onClick={validarEntrada}
          className="w-full bg-yellow-500 p-3 rounded-xl font-bold"
        >
          Entrar ⚽
        </button>
      </div>
    </main>
  );
}