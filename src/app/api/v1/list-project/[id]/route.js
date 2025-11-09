const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/api/v1/list-project/${id}`, {
      method: "DELETE",
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      return Response.json(data, { status: res.status });
    } else {
      const text = await res.text();
      console.error("❌ Unexpected backend response:", text);
      return Response.json(
        { error: "Invalid backend response" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("DELETE error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();

    const res = await fetch(`${API_URL}/api/v1/list-project/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("PUT error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req, context) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return new Response(JSON.stringify({ data: null, message: "Missing ID" }), {
      status: 400,
    });
  }

  const res = await fetch(`${API_URL}/api/v1/list-project/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ data: null, message: "Not found" }), {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
