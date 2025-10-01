import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export const formatDate = (
  date: string | Date | number | undefined | null = new Date(),
) => {
  return dayjs(date).utcOffset(0, true).tz('America/El_Salvador');
};

export const formatDateUtc = (
  date: string | Date | number | undefined | null = new Date(),
) => {
  return dayjs(date).utc();
};

export default dayjs;
