export function text(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/[\\`*_[\]<>#|]/g, "\\$&");
}
export function link(label: string, url: string) {
  return `[${text(label)}](${url.replace(/[\s()<>]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)})`;
}
export function projectList(projects: readonly BestOfJS.Project[]) {
  return projects
    .map(
      (project, i) =>
        `${i + 1}. ${link(project.name, `/projects/${project.slug}.md`)} — ${text(project.description)}\n   Stars: ${project.stars}${"score" in project ? `; stars added: ${project.score}` : ""}${
          project.trends
            ? `; trends: ${Object.entries(project.trends)
                .filter(([, value]) => value != null)
                .map(([key, value]) => `${key} ${value}`)
                .join(", ")}`
            : ""
        }`,
    )
    .join("\n\n");
}
export function searchParams(request: Request) {
  const params = new URL(request.url).searchParams;
  return Object.fromEntries(
    [...new Set(params.keys())].map((key) => {
      const values = params.getAll(key);
      return [key, values.length > 1 ? values : values[0]];
    }),
  );
}
export function publicQuery(request: Request) {
  return new URL(request.url).search;
}
