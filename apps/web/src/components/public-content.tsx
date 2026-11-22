import { PageHeading } from "@/components/core/typography";
import { Card } from "@/components/ui/card";
import { publicContent } from "@/server/public-content";
export function PublicContent({ page }: { page: keyof typeof publicContent }) {
  const content = publicContent[page];
  return (
    <>
      <PageHeading title={content.title} />
      <Card className="space-y-6 p-4 font-serif">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-2">
                {paragraph}
              </p>
            ))}
            {"links" in section && (
              <ul className="space-y-1">
                {section.links?.map((link) => (
                  <li key={link.url}>
                    <a className="underline" href={link.url}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </Card>
    </>
  );
}
