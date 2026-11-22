import {
  ADD_PROJECT_REQUEST_URL,
  APP_REPO_URL,
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
          "Best of JS was created in 2015 to help people discover JavaScript and web-platform projects and follow ecosystem trends.",
          "JavaScript, TypeScript, HTML, CSS, and the web platform keep evolving. Best of JS follows a curated catalog rather than scanning every repository on GitHub.",
        ],
      },
      {
        title: "How it works",
        paragraphs: [
          "An automatic task collects GitHub project data and star snapshots every day. The site displays star totals and changes over time to show when projects gain popularity.",
          "Projects and categories are curated by people. GitHub stars indicate popularity; they do not establish quality, security, or suitability for your project.",
        ],
      },
      {
        title: "Suggest a project or support the site",
        paragraphs: [
          "Some great projects will be missing. Suggest a project through GitHub, star the repository, or become a sponsor.",
        ],
        links: [
          { label: "Suggest a project", url: ADD_PROJECT_REQUEST_URL },
          { label: "Source code", url: APP_REPO_URL },
          { label: "Sponsor", url: SPONSOR_URL },
        ],
      },
    ],
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
