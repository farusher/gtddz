export function onRequest(context) {
  return new Response(JSON.stringify({ status: "OK" }), {
    headers: { "Content-Type": "application/json" }
  });
}