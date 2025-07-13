// From https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useViewportSpy.js
import { useLayoutEffect, useState } from "react";

const defaultOptions = {
  root: undefined,
  rootMargin: "0px",
  threshold: 0,
};

/**
 * Uses the IntersectionObserverMock API to tell whether the given DOM Element (from useRef) is visible within the
 * viewport.
 */
export const useViewportSpy = (elementRef, options = defaultOptions) => {
  const [isVisible, setIsVisible] = useState<boolean>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: TODO
  useLayoutEffect(
    () => {
      if (!supportsObserverAPI()) {
        setIsVisible(true);
        return () => {};
      }
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((item) => {
            const nextValue = item.isIntersecting;
            setIsVisible(nextValue);
          }),
        options,
      );

      observer.observe(elementRef.current);

      return () => {
        observer.disconnect(); // eslint-disable-line react-hooks/exhaustive-deps
      };
    },
    [elementRef], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return isVisible;
};

function supportsObserverAPI() {
  return typeof IntersectionObserver === "function";
}
