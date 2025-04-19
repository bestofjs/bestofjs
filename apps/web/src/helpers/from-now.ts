import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function fromNow(strDate: string | Date): string {
  return dayjs().to(dayjs(strDate));
}
