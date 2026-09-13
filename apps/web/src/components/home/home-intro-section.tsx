import { linkVariants } from "@/components/ui/link";
import { currentApp, hostByApp, type WebApp, webApps } from "@/config/apps";

import { AiToolingInfo } from "./ai-tooling-info";
import { TypeWriter } from "./typewriter";

export function HomeIntroSection() {
  const topics = [
    "JavaScript",
    "TypeScript",
    "Node.js",
    "React",
    "Vue.js",
    "Svelte",
    "Astro",
    "Bun",
    "Deno",
    "CSS-in-JS",
  ];
  const Intro = introByApp[currentApp];
  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="font-serif text-3xl leading-tight tracking-tighter md:text-4xl">
        <TypeWriter topics={topics} sleepTime={100} loop />
      </h1>
      <p className="font-serif text-lg text-muted-foreground">
        <Intro />
      </p>
    </div>
  );
}

/**
 * The intro is the one piece of copy that cannot be a per-app string: the two
 * deployments say structurally different things, one with a popover and one
 * with a link. A lookup table keeps that difference declarative — still no
 * `if (isNoAI)` — while leaving the markup where markup belongs rather than in
 * `config/apps`.
 */
const introByApp: Record<WebApp, () => React.ReactNode> = {
  [webApps.MAIN]: MainIntro,
  [webApps.NOAI]: NoAiIntro,
};

function MainIntro() {
  return (
    <>
      A place to find the best open source projects related to the web platform:
      <br />
      JS, HTML, CSS, but also TypeScript, Node.js, Deno, Bun, AI tooling...
      <AiToolingInfo host={hostByApp[webApps.NOAI]} />
    </>
  );
}

/**
 * Shorter than the main one, and it does not re-explain Best of JS: someone on
 * this subdomain arrived on purpose. It still names the parent site, because
 * search traffic can land here cold with no idea what it is a version *of*.
 */
function NoAiIntro() {
  return (
    <>
      The <strong className="font-semibold">No AI</strong> version of{" "}
      <a href={`https://${hostByApp[webApps.MAIN]}`} className={linkVariants()}>
        Best of JS
      </a>
      :
      <br />
      the best open source projects of the web platform, minus AI tooling.
    </>
  );
}
