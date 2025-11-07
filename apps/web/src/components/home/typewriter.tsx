"use client";

import { useEffect, useRef } from "react";

type Props = {
  sleepTime: number;
  topics: string[];
  loop?: boolean;
};

export function TypeWriter({ topics, sleepTime, loop = false }: Props) {
  const typeWriterRef = useRef<HTMLSpanElement | null>(null);
  const defaultTopic = topics[0];
  const startedRef = useRef(false);
  const cancelledRef = useRef(false);
  const currentTopicIndexRef = useRef(0);
  const reverseRef = useRef(true);

  useEffect(() => {
    // When (re)mounted or made visible again, allow running and clear cancellation
    cancelledRef.current = false;
    if (startedRef.current) return;
    startedRef.current = true;

    const timeout = setTimeout(() => {
      if (!cancelledRef.current) {
        animateText();
      }
    }, 3000);

    return () => {
      // Mark as cancelled and allow a future restart on visibility/remount
      cancelledRef.current = true;
      startedRef.current = false;
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function animateText() {
    let index = 0;
    while (loop || index < topics.length) {
      if (cancelledRef.current) return;

      const currentTopic = topics[currentTopicIndexRef.current];

      if (reverseRef.current) {
        await reduceText(currentTopic);
        await sleep(sleepTime * 5);
      } else {
        await incrementText(currentTopic);
        await sleep(sleepTime * 15);

        await reduceText(currentTopic);
        await sleep(sleepTime * 5);
      }

      index++;
      if (currentTopicIndexRef.current === topics.length - 1) {
        currentTopicIndexRef.current = 0;
      } else {
        currentTopicIndexRef.current++;
      }
    }
  }

  async function incrementText(currentTopic: string) {
    for (let i = 0; i < currentTopic.length; i++) {
      if (cancelledRef.current) return;
      if (typeWriterRef.current) {
        typeWriterRef.current.textContent = currentTopic.substring(0, i + 1);
        await sleep(sleepTime);
      }
    }
  }

  async function reduceText(currentTopic: string) {
    for (let i = currentTopic.length; i > 0; i--) {
      if (cancelledRef.current) return;
      if (typeWriterRef.current) {
        typeWriterRef.current.textContent = currentTopic.substring(0, i - 1);
        if (i === 1) {
          reverseRef.current = false;
          await sleep(sleepTime);
        }
        await sleep(sleepTime);
      }
    }
  }

  function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

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
