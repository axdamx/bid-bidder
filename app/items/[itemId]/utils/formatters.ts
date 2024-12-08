import { formatDistance, format } from "date-fns";

export function formatTimestamp(timestamp: string) {
  const now = new Date();
  const date = new Date(timestamp + "Z");
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  return formatDistance(date, now, {
    addSuffix: true,
    includeSeconds: true,
  });
}

export function formatCurrency(value: number) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return formattedValue;
}

export function getDateInfo(dateString: string) {
  const targetDate = new Date(dateString);
  const formattedDate = format(targetDate, "MMMM d, yyyy");
  const formattedTime = format(targetDate, "hh:mm a");

  return {
    formattedDate,
    formattedTime,
  };
}
