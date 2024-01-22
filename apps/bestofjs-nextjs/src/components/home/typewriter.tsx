"use client";

import { useEffect, useRef } from "react";

type Props = {
  sleepTime: number;
  topics: string[];
  loop?: boolean;
};

export function TypeWriter({ topics, sleepTime, loop = false }: Props) {
  const typeWriterRef = useRef<HTMLSpanElement | null>(null);
  let currentTopicIndex = 0;
  const defaultTopic = topics[0];
  let reverse = true;

  function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async function incrementText(currentTopic: string) {
    for (let i = 0; i < currentTopic.length; i++) {
      if (typeWriterRef.current) {
        typeWriterRef.current.textContent = currentTopic.substring(0, i + 1);
        await sleep(sleepTime);
      }
    }
  }

  async function reduceText(currentTopic: string) {
    for (let i = currentTopic.length; i > 0; i--) {
      if (typeWriterRef.current) {
        typeWriterRef.current.textContent = currentTopic.substring(0, i - 1);
        if (i === 1) {
          reverse = false;
          await sleep(sleepTime);
        }
        await sleep(sleepTime);
      }
    }
  }

  async function animateText() {
    let index = 0;
    while (loop || index < topics.length) {
      const currentTopic = topics[currentTopicIndex];

      if (reverse) {
        await reduceText(currentTopic);
        await sleep(sleepTime * 5);
      } else {
        await incrementText(currentTopic);
        await sleep(sleepTime * 15);

        await reduceText(currentTopic);
        await sleep(sleepTime * 5);
      }

      index++;
      if (currentTopicIndex === topics.length - 1) {
        currentTopicIndex = 0;
      } else {
        currentTopicIndex++;
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      animateText();
    }, 3000);

    return () => {
      clearTimeout(timeout)
    }
  }, []);
  return (
    <div className="flex whitespace-pre-wrap">
      The Best of{" "}
      <span
        className="underline decoration-[var(--logo-color)]"
        ref={typeWriterRef}
      >
        {defaultTopic}
      </span>
      <span className="animate-cursor-pulse">|</span>
    </div>
  );
}
