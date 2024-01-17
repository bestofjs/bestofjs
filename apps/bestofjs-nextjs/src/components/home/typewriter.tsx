"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  sleepTime: number;
  topics: string[];
  loop?: boolean;
};

export function TypeWriter({ topics, sleepTime, loop = false }: Props) {
  const typeWriterRef = useRef<HTMLSpanElement | null>(null);
  const [currentRef, setCurrentRef] = useState<HTMLSpanElement | null>(null);
  let currentTopicIndex = 0;

  useEffect(() => {
    if (typeWriterRef && typeWriterRef.current) {
      setCurrentRef(typeWriterRef.current);
    }
  }, []);

  function sleep(miliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
  }

  async function incrementText(currentTopic: string) {
    for (let i = 0; i < currentTopic.length; i++) {
      if (currentRef) {
        currentRef.innerText = currentTopic.substring(0, i + 1);
        await sleep(sleepTime);
      }
    }
  }

  async function reduceText(currentTopic: string) {
    for (let i = currentTopic.length; i > 0; i--) {
      if (currentRef) {
        currentRef.innerText = currentTopic.substring(0, i - 1);
        await sleep(sleepTime);
      }
    }
  }

  async function animateText() {
    let i = 0;

    while (loop || i < topics.length) {
      const currentTopic = topics[currentTopicIndex];

      await incrementText(currentTopic);
      await sleep(sleepTime * 10);

      await reduceText(currentTopic);
      await sleep(sleepTime * 5);

      // reset looping through topics array
      if (currentTopicIndex === topics.length - 1) {
        currentTopicIndex = 0;
      } else {
        currentTopicIndex++;
      }
      i++;
    }
  }

  animateText();
  return (
    <div className="flex whitespace-pre-wrap">
      The Best of{" "}
      <span
        className="underline decoration-[var(--logo-color)]"
        ref={typeWriterRef}
        id="typewriter"
      ></span>
      <span className="animate-cursor-pulse" id="cursor">
        |
      </span>
    </div>
  );
}
