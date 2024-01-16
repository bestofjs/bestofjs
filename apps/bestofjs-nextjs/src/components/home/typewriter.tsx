"use client";

import { useEffect, useState } from "react";

export function TypeWriter({
  text,
  delay,
  infinite,
}: {
  text: string;
  delay: number;
  infinite: boolean;
}) {
  // const typeWriterRef = useRef<HTMLSpanElement | null>(null)
  // const [ref, setRef] = useState<HTMLSpanElement | null>(null)
  const [currentText, setCurrentText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // useEffect(() => {
  //   if (typeWriterRef && typeWriterRef.current) {
  //     setRef(typeWriterRef.current)
  //   }
  // },[])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (currentIndex === (text.length - 1)) {
      // TODO finish move in reverse to remove character
    }
    else if (infinite) {
      setCurrentIndex(0);
      setCurrentText("");
    }
  }, [currentIndex, delay, text, infinite]);

  // function sleep(miliseconds: number) {
  //   return new Promise((resolve) => setTimeout(resolve, miliseconds))
  // }

  // const topics = ["JavaScript", "TypeScript", "React"];

  // let sleepTime = 100;

  // let currentTopicIndex = 0;

  //   const writeLoop = async () => {
  //     while (true) {
  //       const currentWord = topics[currentTopicIndex]

  //       for (let i = 0; i < currentWord.length; i++) {
  //         console.log(ref)
  //         if (ref && ref.innerText) {
  //           ref.innerText = currentWord.substring(0, i + 1)
  //           await sleep(sleepTime)
  //         }
  //       }

  //       await sleep(sleepTime * 10)

  //       for (let i = currentWord.length; i > 0; i--) {
  //         if (ref && ref.innerText) {
  //           ref.innerText = currentWord.substring(0, i - 1)
  //           await sleep(sleepTime)
  //         }

  //       }
  //       await sleep(sleepTime * 5)
  //   };
  // }

  //   writeLoop()

  return (
    <div className="flex whitespace-pre-wrap">
      The Best of <span id="typewriter">{currentText}</span>
      <span className="animate-cursor-pulse" id="cursor">
        |
      </span>
    </div>
  );
}
