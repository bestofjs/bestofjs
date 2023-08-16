import NextLink from "next/link";
import numeral from "numeral";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProjectAvatar } from "@/components/core";

type Props = {
  members: BestOfJS.HallOfFameMember[];
};
export function HallOfFameMemberList({ members }: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {members.map((member) => (
        <HallOfFameMember key={member.username} member={member} />
      ))}
    </div>
  );
}

function HallOfFameMember({ member }: { member: BestOfJS.HallOfFameMember }) {
  return (
    <Card className="sm:rounded-none">
      <div className="flex items-center border-b">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${member.avatar}&s=100`}
          width="100"
          height="100"
          alt={member.username}
          className="display-block h-[100px] w-[100px]"
        />
        <div className="flex flex-1 flex-col justify-center gap-2 px-4">
          <div className="flex items-center">
            <span className="text-xl">{member.name}</span>
          </div>
          <div className="text-muted-foreground">
            <a
              href={`https://github.com/${member.username}`}
              className="font-mono text-primary hover:underline"
            >
              {member.username}
            </a>{" "}
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
                  "font-normal"
                )}
              >
                {project.icon && (
                  <ProjectAvatar project={project} size={20} className="mr-2" />
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

function formatNumber(value: number) {
  const digitsFormat = value > 1000 ? "0.0 a" : "0 a";
  return numeral(value).format(digitsFormat);
}
