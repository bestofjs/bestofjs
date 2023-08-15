import Image from "next/image";
import NextLink from "next/link";
import numeral from "numeral";
import { GoMarkGithub } from "react-icons/go";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
      <div className="flex border-b">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${member.avatar}&s=100`}
          width="100"
          height="100"
          alt={member.username}
          className="display-block h-[100px] w-[100px]"
        />
        <div className="flex flex-1 flex-col justify-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{member.name}</span>
            <a
              href={`https://github.com/${member.username}`}
              aria-label="GitHub repository"
              rel="noopener noreferrer"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full",
                "w-10",
                "h-10",
                "p-0"
              )}
            >
              <GoMarkGithub size={24} />
            </a>
          </div>
          <div className="text-muted-foreground">{member.username}</div>
          <div className="text-secondary-foreground">
            {formatNumber(member.followers)} followers
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
