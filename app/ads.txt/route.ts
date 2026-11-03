export const dynamic = "force-static";

export function GET() {
  return new Response("google.com, pub-5952797612434262, DIRECT, f08c47fec0942fa0\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
