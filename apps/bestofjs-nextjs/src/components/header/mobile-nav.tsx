"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/20/solid";

import { extraNavItems, mainNavItems } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Bars3Icon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SidebarContent onOpenChange={setIsOpen} />
      </SheetContent>
    </Sheet>
  );
}

function SidebarContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const allNavItems = [...mainNavItems, ...extraNavItems];

  return (
    <>
      <Link
        href="/"
        className="mb-4 flex items-center space-x-2"
        aria-label="Best of JS"
      >
        <Icons.logo
          width={130}
          height={37.15}
          className="h-[37.15px] w-[130px] text-primary"
        />
      </Link>
      <div className="w-full space-y-2">
        {allNavItems.map(
          (item, index) =>
            item.href && (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center",
                  item.isActive(pathname)
                    ? "text-foreground"
                    : "text-foreground/60",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
                onClick={() => onOpenChange(false)}
              >
                {item.title}
              </Link>
            )
        )}
      </div>
    </>
  );
}
