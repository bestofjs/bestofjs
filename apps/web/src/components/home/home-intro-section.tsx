import { TypeWriter } from "./typewriter";

export function HomeIntroSection() {
  const topics = [
    "JavaScript",
    "TypeScript",
    "Node.js",
    "React",
    "Vue.js",
    "Astro",
    "Bun",
    "Deno",
    "CSS-in-JS",
  ];
  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="font-serif text-3xl leading-tight tracking-tighter md:text-4xl">
        <TypeWriter topics={topics} sleepTime={100} loop />
      </h1>
      <p className="font-serif text-lg text-muted-foreground">
        A place to find the best open source projects related to the web
        platform:
        <br />
        JS, HTML, CSS, but also TypeScript, Node.js, Deno, Bun...
      </p>
    </div>
  );
}
