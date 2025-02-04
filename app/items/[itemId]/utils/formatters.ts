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

export function formatCurrency(value: number): string {
  let formattedValue: string;

  if (value >= 1_000_000) {
    // Divide by 1,000,000 and append "M"
    const millionValue = value / 1_000_000;
    formattedValue =
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: millionValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(millionValue) + "M";
  } else {
    // Format normally for values less than 1,000,000
    formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return formattedValue;
}

export function getDateInfo(dateString: string) {
  // If the date doesn't end with Z, assume it's UTC and add Z
  const utcDate = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  const targetDate = new Date(utcDate);
  
  // Format in local timezone
  const formattedDate = format(targetDate, "MMMM d, yyyy");
  const formattedTime = format(targetDate, "hh:mm a");
  
  return {
    formattedDate,
    formattedTime,
  };
}
