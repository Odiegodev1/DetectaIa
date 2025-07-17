// src/app/api/detectaia/route.ts

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch('https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': 'ai-content-detector-ai-gpt.p.rapidapi.com',
      'x-rapidapi-key': `${process.env.RAPIDAPI_KEY}`, // Certifique-se de definir essa variável de ambiente
    },
    body: JSON.stringify({ text: body.text }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET para teste simples ou info básica
export async function GET() {
  // Você pode retornar algo simples, ou fazer outra chamada de API se quiser

  const message = { message: "API detectaia funcionando. Use POST para enviar texto." };

  return new Response(JSON.stringify(message), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
