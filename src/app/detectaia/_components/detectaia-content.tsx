"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CirclePlus, SlidersHorizontal } from "lucide-react";

interface Props {
  onResultado?: (resultado: ResultadoIA) => void;
}

interface Sentenca {
  text: string;
}

interface ResultadoIA {
  aiWords: number;
  fakePercentage: number;
  isHuman: number;
  otherFeedback: string;
  sentences?: Sentenca[];
  status: boolean;
  textWords: number;
}

export function classificarTexto(resultado: ResultadoIA): string {
  if (!resultado || !resultado.status) {
    return "❌ Resultado inválido ou análise não concluída";
  }

  const fakePercent = resultado.fakePercentage;
  const probHumano = resultado.isHuman;

  if (fakePercent > 70 || probHumano < 30) {
    return `🤖 Texto gerado por IA: ${fakePercent.toFixed(1)}% de certeza`;
  } else {
    return `👤 Texto escrito por humano: ${probHumano.toFixed(1)}% de certeza`;
  }
}

export function DetectaIaContent({ onResultado }: Props) {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState<ResultadoIA | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extraindoImagem, setExtraindoImagem] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function analisarTexto() {
    if (!texto.trim()) {
      setError("Por favor, insira um texto.");
      setResultado(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/detectai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: texto }),
      });

      const data = await response.json();

      const resultadoConvertido: ResultadoIA = {
        aiWords: Number(data.aiWords) || 0,
        fakePercentage: Number(data.fakePercentage) || 0,
        isHuman: Number(data.isHuman) || 0,
        otherFeedback: data.otherFeedback || "",
        sentences: data.sentences || [],
        status: data.status ?? true,
        textWords: Number(data.textWords) || 0,
      };

      setResultado(resultadoConvertido);
      if (onResultado) onResultado(resultadoConvertido);
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtraindoImagem(true);
    setError(null);
    setResultado(null);
    setTexto(""); // limpa o texto para novo carregamento

    // Revoga URL antiga para evitar vazamento de memória
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file)); // mostra preview

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/detectIaImg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erro ao extrair texto da imagem.");
      }

      const data = await res.json();
      const textoExtraido = data.text?.trim();

      if (textoExtraido) {
        setTexto(textoExtraido); // insere texto extraído no input
      } else {
        setError("Não foi possível extrair texto da imagem.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao enviar imagem.");
    } finally {
      setExtraindoImagem(false);
    }
  }

  return (
    <>
  
      <Input
        className="md:w-full h-full border-none text-zinc-200 placeholder:text-zinc-400"
        placeholder="Cole o texto aqui ou envie uma imagem..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        disabled={extraindoImagem}
      />

      {/* Preview da imagem, opcional */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Pré-visualização da imagem"
          className="mt-2 max-h-48 object-contain rounded border border-gray-300"
        />
      )}

      <div className="flex md:space-x-2 gap-15 md:px-2  md:items-center md:justify-between border-t border-zinc-700 pt-2">
        <div className="flex md:gap-3 gap-1 items-center justify-center">
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-md cursor-pointer"
          >
            <CirclePlus className="md:size-5 size-4" color="white" />
            <span className="text-sm">Imagem</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <SlidersHorizontal className="md:size-5 size-4" color="white" />
          <h1 className="md:text-md text-xs text-white">Ferramentas</h1>
        </div>

        <button
          onClick={analisarTexto}
          disabled={loading || extraindoImagem}
          className={`flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white md:px-4 px-2 md:py-2 py-1 rounded-md
            ${loading || extraindoImagem ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Analisando..." : extraindoImagem ? "Extraindo..." : "Enviar"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}
