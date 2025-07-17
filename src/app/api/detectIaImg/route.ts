export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image");
  
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: "Arquivo inválido" }), { status: 400 });
  }

  // Cria um novo FormData para enviar para a API externa
  const externalFormData = new FormData();
  externalFormData.append("image", file, file.name);

  const response = await fetch('https://image-to-text30.p.rapidapi.com/api/rapidapi/image-to-text', {
    method: 'POST',
    headers: {
      // NÃO coloque Content-Type aqui, o fetch define automaticamente para multipart/form-data com boundary
      'x-rapidapi-host': 'image-to-text30.p.rapidapi.com',
      'x-rapidapi-key': '479f01ec99mshda31a70cfec808dp1d38abjsnaa46629228c9',
    },
    body: externalFormData as any, // no Node fetch isso funciona
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
