"use client";

import { fromNow } from "@/helpers/from-now";

type FromNowProps = {
  date: string | Date;
};

export function FromNow({ date }: FromNowProps) {
  return <>{fromNow(date)}</>;
}
