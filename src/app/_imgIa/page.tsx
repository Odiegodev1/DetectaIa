"use client";
import { useState } from "react";

export default function DetectaIAPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setResultado(null);
  setErro(null);

  if (!file) {
    setErro("Por favor, selecione uma imagem para enviar.");
    return;
  }

  setCarregando(true);

  try {
    // 1. Enviar imagem para extrair texto
    const formData = new FormData();
    formData.append("image", file);

    const resOCR = await fetch("http://localhost:3000/api/detectIaImg", {
      method: "POST",
      body: formData,
    });

    if (!resOCR.ok) {
      throw new Error("Erro ao extrair texto da imagem.");
    }

    const ocrData = await resOCR.json();
    const textoExtraido = ocrData.text?.trim();

    if (!textoExtraido || textoExtraido.length < 10) {
      throw new Error("Texto extraído muito curto ou inválido.");
    }

    // 2. Tentar verificar com API de IA, mas se falhar, exibe o texto mesmo assim
    let iaData = null;

    try {
      const resIA = await fetch("http://localhost:3000/api/detectai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textoExtraido }),
      });

      if (resIA.ok) {
        iaData = await resIA.json();
      } else {
        console.warn("Falha na análise IA, mas texto será exibido.");
      }
    } catch (iaError) {
      console.warn("Erro na verificação por IA:", iaError);
    }

    // 3. Sempre exibe o texto, com ou sem análise IA
    setResultado({
      texto: textoExtraido,
      analiseIA: iaData,
    });

  } catch (error: any) {
    setErro(error.message || "Erro desconhecido.");
  } finally {
    setCarregando(false);
  }
}



  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detectar Texto na Imagem</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
  <label
    htmlFor="file-upload"
    className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
  >
    {file ? "Trocar Imagem" : "Selecionar Imagem"}
  </label>
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      } else {
        setFile(null);
      }
    }}
    className="hidden"
    required
  />

  {/* Preview da imagem */}
  {file && (
    <img
      src={URL.createObjectURL(file)}
      alt="Pré-visualização"
      className="max-h-64 object-contain border border-gray-300 rounded"
    />
  )}
</div>

        <button
          type="submit"
          disabled={carregando}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? "Analisando..." : "Detectar Texto"}
        </button>
      </form>

      {erro && <p className="mt-4 text-red-600 font-semibold">Erro: {erro}</p>}

      {resultado && (
        <section className="mt-6 bg-gray-100 p-4 rounded border border-gray-300">
          <h2 className="font-semibold mb-2">Resultado:</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-800">
        {resultado.text}
        </p>
        {resultado && (
  <section className="mt-6 bg-gray-100 p-4 rounded border border-gray-300 space-y-4">
    <div>
      <h2 className="font-semibold mb-2">Texto Extraído:</h2>
      <p className="whitespace-pre-wrap text-sm text-gray-800">{resultado.texto}</p>
    </div>
    <div>
      <h2 className="font-semibold mb-2">Análise IA:</h2>
      <pre className="text-sm text-gray-800 bg-white p-2 rounded border">
        {JSON.stringify(resultado.analiseIA, null, 2)}
      </pre>
    </div>
  </section>
)}

        </section>
      )}
    </main>
  );
}