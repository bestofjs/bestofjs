import { api } from "@/server/api-remote-json";

export const runtime = "edge";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_req: Request, props: Context) {
  const params = await props.params;

  const { slug } = params;

  const tag = await api.tags.getTagBySlug(slug);

  return new Response(JSON.stringify(tag), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
