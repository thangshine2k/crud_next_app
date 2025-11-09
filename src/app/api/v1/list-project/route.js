const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const res = await fetch(`${API_URL}/api/v1/list-project`, { cache: "no-store" });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();
  const res = await fetch(`${API_URL}/api/v1/list-project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return Response.json(data);
}
