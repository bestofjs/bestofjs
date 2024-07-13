"use client";

import { BaseSyntheticEvent } from "react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoonIcon, SunIcon } from "./core";

export function ThemeToggle() {
  const { changeThemeWithAnimation } = useChangeThemeWithAnimation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(event) => changeThemeWithAnimation("light", event)}
          className="flex items-center justify-between"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => changeThemeWithAnimation("dark", event)}
          className="flex items-center justify-between"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            changeThemeWithAnimation("system", event);
          }}
          className="flex items-center justify-between"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

export const useChangeThemeWithAnimation = () => {
  const { setTheme, systemTheme, theme: currentTheme } = useTheme();

  const changeThemeWithAnimation = async (
    theme: string,
    event?: BaseSyntheticEvent
  ) => {
    if (currentTheme === theme) return;

    const actualThemeToSet = theme === "system" ? systemTheme : theme;

    // if switching to the same theme, avoid unnecessary transitions
    // works also if for example switching from light to system, where system preference is light
    if (!enableTransitions() || actualThemeToSet === currentTheme) {
      setTheme(theme);
      return;
    }

    let x: number;
    let y: number;

    // default values start animating theme change from the page center
    const defaultX = innerWidth / 2;
    const defaultY = innerHeight / 2;

    if (!event) {
      x = defaultX;
      y = defaultY;
    } else {
      const rect = event.target?.getBoundingClientRect?.();

      if (rect && typeof rect.x === "number" && typeof rect.y === "number") {
        x = rect.x + rect.width / 2;
        y = rect.y + rect.height / 2;
      } else {
        x = defaultX;
        y = defaultY;
      }
    }

    // Get the distance to the furthest corner
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    const transition = document.startViewTransition(async () => {
      flushSync(() => {
        setTheme(theme);
      });
    });

    const animateFromMiddle = async (transition: ViewTransition) => {
      try {
        await transition.ready;

        document.documentElement.animate(
          {
            clipPath:
              actualThemeToSet === "light" ? clipPath.reverse() : clipPath,
          },
          {
            duration: 500,
            easing: "ease-in",
            pseudoElement: `::view-transition-${
              actualThemeToSet === "light" ? "old" : "new"
            }(root)`,
          }
        );
      } catch (e) {
        console.error(e);
      }
    };

    animateFromMiddle(transition);

    await transition.finished;
  };

  return { changeThemeWithAnimation };
};
