import { api } from "@/server/api-remote-json";

export const runtime = "edge";

type Context = { params: { slug: string } };
export async function GET(_req: Request, { params: { slug } }: Context) {
  const { tags } = await api.tags.getTagBySlug({ criteria: { code: slug } });
  const output = { tags };
  console.log("TAGS", tags)
  return new Response(JSON.stringify(output), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
