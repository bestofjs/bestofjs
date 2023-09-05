import { useEffect, useState } from "react";

export function useIsApplePlatform() {
  let [isApplePlatform, setIsApplePlatform] = useState<boolean>();

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
        setIsApplePlatform(true);
      } else {
        setIsApplePlatform(false);
      }
    }
  }, []);

  return isApplePlatform;
}
