import NextLink from "next/link";

import type { HallOfFameMember } from "@repo/db/hall-of-fame";

import { ProjectCustomLogo } from "@/components/core";
import { ExternalLink } from "@/components/core/typography";
import { badgeVariants } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  members: HallOfFameMember[];
};
export function HallOfFameMemberList({ members }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {members.map((member) => (
        <HallOfFameMemberCard key={member.username} member={member} />
      ))}
    </div>
  );
}

function HallOfFameMemberCard({ member }: { member: HallOfFameMember }) {
  return (
    <Card className="sm:rounded-none">
      <div className="flex items-center border-b">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${member.avatar}&s=100`}
          width="100"
          height="100"
          alt={member.username}
          className="display-block size-[100px]"
          loading="lazy"
        />
        <div className="flex flex-1 flex-col justify-center gap-2 px-4">
          <div className="flex items-center">
            <span className="font-serif text-xl">{member.name}</span>
          </div>
          <div className="text-muted-foreground">
            <ExternalLink url={`https://github.com/${member.username}`}>
              {member.username}
            </ExternalLink>{" "}
            on GitHub
          </div>
        </div>
      </div>
      <div className="divide-y">
        {member.bio && <div className="p-4">{member.bio}</div>}
        {member.projects.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4">
            {member.projects.map((project) => (
              <NextLink
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={cn(
                  badgeVariants({ variant: "outline" }),
                  "text-md",
                  "rounded-sm",
                  "hover:bg-accent",
                  "font-normal",
                )}
              >
                {project.logo && (
                  <ProjectCustomLogo
                    filename={project.logo}
                    name={project.name}
                    size={20}
                    className="mr-2"
                  />
                )}
                {project.name}
              </NextLink>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
