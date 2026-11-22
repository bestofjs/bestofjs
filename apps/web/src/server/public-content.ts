import {
  ADD_PROJECT_REQUEST_URL,
  ISSUE_TRACKER_URL,
  SPONSOR_URL,
} from "@/config/site";
export const publicContent = {
  about: {
    title: "About Best of JS",
    sections: [
      {
        title: "Why Best of JS?",
        paragraphs: [
          "I started Best of JS in 2015 because keeping up with JavaScript and the web was already a job in itself. I wanted a place where developers could find a library for the problem in front of them, see what else was out there, and come back later to see what had changed.",
        ],
      },
      {
        title: "How I curate the catalog",
        paragraphs: [
          "I look for projects in newsletters, blog posts, and suggestions from readers. I decide what to add and how to tag it, and I revisit those tags as the ecosystem changes. Good tags make it easier to find alternatives, especially when you know what you want to build but don’t know the names of the tools yet.",
        ],
      },
      {
        title: "What the stars tell you",
        paragraphs: [
          "Best of JS takes a snapshot of GitHub stars every day. A star total tells you how much attention a project has received over its lifetime. The daily changes show what developers are paying attention to now. I use those trends as a starting point for exploring a project and deciding whether it’s worth a closer look.",
        ],
      },
      {
        title: "Help improve the catalog",
        paragraphs: [
          "If you’ve found a project that belongs here, I’d love to hear about it. Tell me what it does and why you think other developers should know about it.",
        ],
        links: [{ label: "Suggest a project", url: ADD_PROJECT_REQUEST_URL }],
      },
      {
        title: "Support Best of JS",
        paragraphs: [
          "If Best of JS has helped you find a tool you now use, you can support my work through either of these platforms.",
        ],
        links: [
          { label: "GitHub sponsors", url: SPONSOR_URL },
          {
            label: "Open Collective",
            url: "https://opencollective.com/bestofjs",
          },
        ],
      },
    ],
    closing: "Thank you for your support. We are all made of stars!",
    signature: "Michael Rambeau",
  },
  privacy: {
    title: "Privacy",
    sections: [
      {
        title: "Browsing Best of JS",
        paragraphs: [
          "The public website does not require an account. It is hosted on Vercel, which processes requests to deliver and operate the site.",
          "Best of JS includes Vercel Web Analytics to measure site usage. Vercel describes this service as using aggregated analytics without tracking cookies. See Vercel’s documentation for the data it processes and its retention practices.",
        ],
        links: [
          {
            label: "Vercel Analytics privacy information",
            url: "https://vercel.com/docs/analytics/privacy-policy",
          },
          {
            label: "Vercel privacy policy",
            url: "https://vercel.com/legal/privacy-policy",
          },
        ],
      },
      {
        title: "Preferences and public project data",
        paragraphs: [
          "The site remembers your selected color theme in your browser’s local storage.",
          "Best of JS collects public GitHub repository and contributor information and public npm package information to build its catalog, trends, and Hall of Fame. Backend services access the GitHub API; you do not need to provide GitHub credentials to browse the site.",
          "Repository README content and project images can load from external services such as GitHub. Following external links or loading external resources sends requests to those services, whose privacy policies apply.",
        ],
      },
      {
        title: "Questions and updates",
        paragraphs: [
          "Use GitHub issues for questions about this page or to report incorrect catalog information. GitHub issues are public. Do not include private information. This page describes the services used by the public website and will be updated as they change.",
        ],
        links: [{ label: "GitHub issues", url: `${ISSUE_TRACKER_URL}/issues` }],
      },
    ],
  },
};
