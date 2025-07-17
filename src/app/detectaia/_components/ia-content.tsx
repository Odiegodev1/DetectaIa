"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DetectaIaContent, classificarTexto } from "../_components/detectaia-content";
import { Bot } from "lucide-react";

interface ResultadoIA {
  aiWords: number;
  fakePercentage: number;
  isHuman: number;
  otherFeedback: string;
  sentences?: { text: string }[];
  status: boolean;
  textWords: number;
}

export function IaContent() {
  const [resultado, setResultado] = useState<ResultadoIA | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-full px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="w-full max-w-xl p-4 sm:p-6 md:p-8">
        <main className="flex flex-col items-center justify-center space-y-6">
          <article className="flex flex-col items-center mt-8 w-full">
            <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-emerald-500">
              <Bot className="w-8 h-8" />
              DetectaIA
            </h1>
            <p className="text-xs sm:text-sm text-emerald-300 text-center mt-1">
              Será que foi um robô que escreveu? Analise e descubra!
            </p>

            {resultado && (
              <Card className="w-full bg-zinc-800 mt-6">
                <CardContent className="flex flex-col gap-3 overflow-auto">
                  <h2 className="text-lg font-bold text-emerald-500">Resultado da Análise</h2>
                  <p className="text-sm text-zinc-300">Texto analisado: {resultado.textWords} palavras</p>
                  <p className="text-sm text-zinc-300">Palavras de IA: {resultado.aiWords}</p>
                  <p className="text-sm text-zinc-300">Probabilidade de ser humano: {resultado.isHuman}%</p>
                  <p className="text-sm text-zinc-300">Probabilidade de ser IA: {resultado.fakePercentage}%</p>
                  <p
                    className={`text-xs sm:text-sm text-white font-bold px-2 py-4 rounded-md text-center w-full ${
                      resultado.fakePercentage > 70 || resultado.isHuman < 30
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                  >
                    {classificarTexto(resultado)}
                  </p>
                  {resultado.otherFeedback && (
                    <p className="text-sm text-zinc-300">{resultado.otherFeedback}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </article>
        </main>
      </div>

      <div className="w-full max-w-xl space-y-6 my-10">
        <h1 className="text-xs sm:text-sm md:text-base font-bold text-zinc-100 text-center">
          Será que uma IA escreveu isso? Analise agora e descubra!
        </h1>
        <Card className="md:w-full w-[350px] bg-zinc-800">
          <CardContent className="flex flex-col gap-4">
            <DetectaIaContent onResultado={setResultado} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
